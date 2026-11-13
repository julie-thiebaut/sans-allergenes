import { chromium } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RestaurantListSchema } from "../src/data/schemas";
import { ContentTranslationFileSchema } from "../src/i18n/contentTranslation";
import { LOCALES, pagePath, restaurantPath, type Locale, type PageKey } from "../src/i18n/locale";
import { alternateLinks } from "../src/seo/Seo";
import {
  buildAllergensOnlineNoteMeta,
  buildHomeMeta,
  buildLegalMeta,
  buildMapMeta,
  buildPrivacyMeta,
  buildRestaurantMeta,
  OG_LOCALES,
  type PageMeta,
} from "../src/seo/seoData";

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
    `<title data-seo-managed="true">${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" data-seo-managed="true" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" data-seo-managed="true" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" data-seo-managed="true" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" data-seo-managed="true" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" data-seo-managed="true" />`,
    `<meta property="og:type" content="website" data-seo-managed="true" />`,
    `<meta property="og:site_name" content="Sans Allergènes" data-seo-managed="true" />`,
    `<meta property="og:locale" content="${OG_LOCALES[meta.locale]}" data-seo-managed="true" />`,
    ...LOCALES.filter((locale) => locale !== meta.locale).map(
      (locale) =>
        `<meta property="og:locale:alternate" content="${OG_LOCALES[locale]}" data-seo-managed="true" />`,
    ),
    ...alternateLinks(meta).map(
      ({ hreflang, href }) =>
        `<link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(href)}" data-seo-managed="true" />`,
    ),
    meta.ogImage
      ? `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" data-seo-managed="true" />`
      : "",
    meta.ogImage?.startsWith("https://")
      ? `<meta property="og:image:secure_url" content="${escapeHtml(meta.ogImage)}" data-seo-managed="true" />`
      : "",
    meta.ogImageType
      ? `<meta property="og:image:type" content="${escapeHtml(meta.ogImageType)}" data-seo-managed="true" />`
      : "",
    meta.ogImageWidth
      ? `<meta property="og:image:width" content="${meta.ogImageWidth}" data-seo-managed="true" />`
      : "",
    meta.ogImageHeight
      ? `<meta property="og:image:height" content="${meta.ogImageHeight}" data-seo-managed="true" />`
      : "",
    meta.ogImageAlt
      ? `<meta property="og:image:alt" content="${escapeHtml(meta.ogImageAlt)}" data-seo-managed="true" />`
      : "",
    `<meta name="twitter:card" content="${meta.ogImage ? "summary_large_image" : "summary"}" data-seo-managed="true" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" data-seo-managed="true" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" data-seo-managed="true" />`,
    meta.ogImage
      ? `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" data-seo-managed="true" />`
      : "",
    meta.ogImageAlt
      ? `<meta name="twitter:image:alt" content="${escapeHtml(meta.ogImageAlt)}" data-seo-managed="true" />`
      : "",
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
    .replace(/<title\b[^>]*>.*?<\/title>/is, "")
    .replace(/<(?:meta|link)\b[^>]*\bdata-seo-managed=["']true["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']description["'][^>]*>/i, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, "")
    // The language of the page, as the client set it, but stated here so it never depends on it.
    .replace(/<html\b[^>]*>/i, `<html lang="${meta.locale}">`);
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

  const translations = ContentTranslationFileSchema.parse(
    JSON.parse(await readFile(path.join(DIST_DIR, "data", "translations", "en.json"), "utf-8")),
  );

  const pageMetaBuilders: Record<PageKey, (siteUrl: string, locale: Locale) => PageMeta> = {
    home: buildHomeMeta,
    map: buildMapMeta,
    legal: buildLegalMeta,
    privacy: buildPrivacyMeta,
    allergensOnlineNote: buildAllergensOnlineNoteMeta,
  };

  // "/en/map/" → dist/en/map/index.html
  const outFileFor = (urlPath: string) =>
    path.join(DIST_DIR, ...urlPath.split("/").filter(Boolean), "index.html");

  const routes: RouteToRender[] = LOCALES.flatMap((locale) => [
    ...(Object.keys(pageMetaBuilders) as PageKey[]).map((page): RouteToRender => ({
      urlPath: pagePath(page, locale),
      outFile: outFileFor(pagePath(page, locale)),
      meta: pageMetaBuilders[page](SITE_URL, locale),
    })),
    ...restaurants.map((restaurant): RouteToRender => ({
      urlPath: restaurantPath(restaurant.slug, locale),
      outFile: outFileFor(restaurantPath(restaurant.slug, locale)),
      meta: buildRestaurantMeta(restaurant, SITE_URL, restaurants, locale, translations),
    })),
  ]);

  const server = startPreviewServer();
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
  });

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
