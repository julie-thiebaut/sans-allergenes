import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RestaurantListSchema } from "../src/data/schemas";
import { LOCALES, PAGE_PATHS, restaurantPath, type Locale } from "../src/i18n/locale";
import { ALLERGENS_ONLINE_NOTE_DATE } from "../src/seo/seoData";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const BASE_PATH = process.env.BASE_PATH ?? "/";
const SITE_URL = (process.env.SITE_URL ?? `http://localhost:4173${BASE_PATH}`).replace(/\/?$/, "/");

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;");
}

/** "/en/map/" → "https://…/en/map/" */
function absolute(urlPath: string): string {
  return `${SITE_URL}${urlPath.replace(/^\//, "")}`;
}

async function main(): Promise<void> {
  const restaurantsRaw = await readFile(path.join(DIST_DIR, "data", "restaurants.json"), "utf-8");
  const restaurants = RestaurantListSchema.parse(JSON.parse(restaurantsRaw));

  // A date only where the page really has one: a build date on every URL would tell search
  // engines that everything changes at each deploy, and they would stop trusting it.
  // Each page once per language, every version listing the others (hreflang), as search engines
  // expect: a version that does not name its alternates is not recognised as one.
  const pageGroups: Array<{ paths: Record<Locale, string>; lastmod?: string }> = [
    { paths: PAGE_PATHS.home },
    { paths: PAGE_PATHS.map },
    { paths: PAGE_PATHS.legal },
    { paths: PAGE_PATHS.privacy },
    { paths: PAGE_PATHS.allergensOnlineNote, lastmod: ALLERGENS_ONLINE_NOTE_DATE },
    ...restaurants.map((restaurant) => ({
      paths: {
        fr: restaurantPath(restaurant.slug, "fr"),
        en: restaurantPath(restaurant.slug, "en"),
      },
      lastmod: restaurant.lastVerifiedAt?.slice(0, 10),
    })),
  ];

  const entries = pageGroups.flatMap(({ paths, lastmod }) => {
    const alternates = [
      ...LOCALES.map((locale) => ({ hreflang: locale, href: absolute(paths[locale]) })),
      { hreflang: "x-default", href: absolute(paths.fr) },
    ]
      .map(
        ({ hreflang, href }) =>
          `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`,
      )
      .join("");
    const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
    return LOCALES.map(
      (locale) =>
        `  <url><loc>${escapeXml(absolute(paths[locale]))}</loc>${lastmodTag}${alternates}</url>`,
    );
  });

  const sitemap = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...entries,
    `</urlset>`,
  ].join("\n");

  const robots = [`User-agent: *`, `Allow: /`, ``, `Sitemap: ${SITE_URL}sitemap.xml`, ``].join(
    "\n",
  );

  await writeFile(path.join(DIST_DIR, "sitemap.xml"), sitemap, "utf-8");
  await writeFile(path.join(DIST_DIR, "robots.txt"), robots, "utf-8");

  console.log(`✅ sitemap.xml (${entries.length} URLs) et robots.txt générés.`);
}

main().catch((error: unknown) => {
  console.error("❌ Échec de la génération sitemap/robots :", error);
  process.exit(1);
});
