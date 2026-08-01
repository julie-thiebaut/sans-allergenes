import { chromium } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RestaurantListSchema } from "../src/data/schemas";
import { buildHomeMeta, buildRestaurantMeta, type PageMeta } from "../src/seo/seoData";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const BASE_PATH = process.env.BASE_PATH ?? "/";
const PORT = 4173;
const SERVER_ORIGIN = `http://localhost:${PORT}`;
const SITE_URL = (process.env.SITE_URL ?? `${SERVER_ORIGIN}${BASE_PATH}`).replace(/\/?$/, "/");
const READY_TIMEOUT_MS = 30_000;

function startPreviewServer(): ChildProcess {
  // shell: true is required for `spawn` to resolve the npx.cmd shim reliably on Windows
  // (direct spawn of .cmd files can fail with EINVAL depending on the Node/Windows version).
  return spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: ROOT_DIR,
    env: process.env,
    stdio: "inherit",
    shell: true,
  });
}

function stopPreviewServer(server: ChildProcess): void {
  // With shell: true, server.pid is the shell's PID, not vite's — killing just that PID can
  // leave the actual preview server (and its held port) running. taskkill /T kills the whole
  // process tree on Windows; elsewhere a plain kill() is enough since spawn() doesn't need a
  // shell there.
  if (process.platform === "win32" && server.pid) {
    spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill();
  }
}

async function waitForServerReady(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // server not up yet, keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Le serveur de prévisualisation (${url}) n'a pas répondu à temps.`);
}

function joinUrlPath(...segments: string[]): string {
  const joined = segments
    .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return `/${joined}/`.replace(/\/+/g, "/");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function injectHeadTags(html: string, meta: PageMeta): string {
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    meta.ogImage ? `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />` : "",
    meta.jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c")}</script>`
      : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  // The captured HTML already has a <title> and a <meta name="description"> — the static
  // defaults from index.html, possibly already updated in place by the client-side <Seo>
  // component. Strip both before injecting our own so the final page has exactly one of each.
  const cleaned = html
    .replace(/<title>.*?<\/title>/s, "")
    .replace(/<meta\s+name=["']description["'][^>]*>/i, "");
  return cleaned.replace("</head>", `    ${tags}\n  </head>`);
}

interface RouteToRender {
  urlPath: string;
  outFile: string;
  meta: PageMeta;
}

async function main(): Promise<void> {
  const restaurantsRaw = await readFile(path.join(DIST_DIR, "data", "restaurants.json"), "utf-8");
  const restaurants = RestaurantListSchema.parse(JSON.parse(restaurantsRaw));

  const routes: RouteToRender[] = [
    { urlPath: "/", outFile: path.join(DIST_DIR, "index.html"), meta: buildHomeMeta(SITE_URL) },
    ...restaurants.map((restaurant): RouteToRender => ({
      urlPath: `/restaurant/${restaurant.slug}/`,
      outFile: path.join(DIST_DIR, "restaurant", restaurant.slug, "index.html"),
      meta: buildRestaurantMeta(restaurant, SITE_URL),
    })),
  ];

  const server = startPreviewServer();
  const browser = await chromium.launch();

  // Rendered HTML is collected in memory and only written to disk AFTER every route has been
  // crawled. Writing dist/index.html mid-crawl would corrupt the crawl itself: vite preview
  // falls back to index.html for any path that doesn't have a real file yet, so overwriting it
  // early would make every not-yet-visited restaurant route serve the home page's prerendered
  // (already meta-tagged) HTML as its starting document, stacking a second set of head tags on
  // top instead of a clean template.
  const renderedPages: Array<{ outFile: string; html: string }> = [];

  try {
    await waitForServerReady(`${SERVER_ORIGIN}${BASE_PATH}`, READY_TIMEOUT_MS);
    const page = await browser.newPage();

    for (const route of routes) {
      // __prerender=1 forces MapsProvider straight to "disabled" — this build step must never
      // fetch config.json or touch the real Google Maps script.
      const url = `${SERVER_ORIGIN}${joinUrlPath(BASE_PATH, route.urlPath)}?__prerender=1`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForSelector('body[data-ssr-ready="true"]', { timeout: 15_000 });

      const html = await page.content();
      const finalHtml = injectHeadTags(html, route.meta);
      renderedPages.push({ outFile: route.outFile, html: finalHtml });
      console.log(`Prérendu : ${route.urlPath}`);
    }

    await page.close();
  } finally {
    await browser.close();
    stopPreviewServer(server);
  }

  for (const { outFile, html } of renderedPages) {
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, "utf-8");
  }

  console.log(`✅ Prérendu terminé (${routes.length} pages).`);
}

main().catch((error: unknown) => {
  console.error("❌ Échec du prérendu :", error);
  process.exit(1);
});
