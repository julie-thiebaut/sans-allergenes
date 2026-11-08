import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RestaurantListSchema } from "../src/data/schemas";
import { ALLERGENS_ONLINE_NOTE_DATE } from "../src/seo/seoData";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const BASE_PATH = process.env.BASE_PATH ?? "/";
const SITE_URL = (process.env.SITE_URL ?? `http://localhost:4173${BASE_PATH}`).replace(/\/?$/, "/");

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;");
}

async function main(): Promise<void> {
  const restaurantsRaw = await readFile(path.join(DIST_DIR, "data", "restaurants.json"), "utf-8");
  const restaurants = RestaurantListSchema.parse(JSON.parse(restaurantsRaw));

  // A date only where the page really has one: a build date on every URL would tell search
  // engines that everything changes at each deploy, and they would stop trusting it.
  const pages: Array<{ url: string; lastmod?: string }> = [
    { url: SITE_URL },
    { url: `${SITE_URL}carte/` },
    { url: `${SITE_URL}mentions-legales/` },
    { url: `${SITE_URL}confidentialite/` },
    { url: `${SITE_URL}notes/allergenes-en-ligne/`, lastmod: ALLERGENS_ONLINE_NOTE_DATE },
    ...restaurants.map((restaurant) => ({
      url: `${SITE_URL}restaurant/${restaurant.slug}/`,
      lastmod: restaurant.lastVerifiedAt?.slice(0, 10),
    })),
  ];

  const sitemap = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...pages.map(({ url, lastmod }) => {
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
      return `  <url><loc>${escapeXml(url)}</loc>${lastmodTag}</url>`;
    }),
    `</urlset>`,
  ].join("\n");

  const robots = [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${SITE_URL}sitemap.xml`, ``].join(
    "\n",
  );

  await writeFile(path.join(DIST_DIR, "sitemap.xml"), sitemap, "utf-8");
  await writeFile(path.join(DIST_DIR, "robots.txt"), robots, "utf-8");

  console.log(`✅ sitemap.xml (${pages.length} URLs) et robots.txt générés.`);
}

main().catch((error: unknown) => {
  console.error("❌ Échec de la génération sitemap/robots :", error);
  process.exit(1);
});
