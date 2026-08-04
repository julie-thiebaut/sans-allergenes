import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RestaurantListSchema } from "../src/data/schemas";

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

  const urls = [
    SITE_URL,
    `${SITE_URL}carte/`,
    ...restaurants.map((restaurant) => `${SITE_URL}restaurant/${restaurant.slug}/`),
  ];

  const sitemap = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    `</urlset>`,
  ].join("\n");

  const robots = [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${SITE_URL}sitemap.xml`, ``].join(
    "\n",
  );

  await writeFile(path.join(DIST_DIR, "sitemap.xml"), sitemap, "utf-8");
  await writeFile(path.join(DIST_DIR, "robots.txt"), robots, "utf-8");

  console.log(`✅ sitemap.xml (${urls.length} URLs) et robots.txt générés.`);
}

main().catch((error: unknown) => {
  console.error("❌ Échec de la génération sitemap/robots :", error);
  process.exit(1);
});
