/**
 * The site speaks French at its historical addresses and English under /en/. The language is read
 * from the address alone, never from the browser or a stored choice: a page then always says the
 * same thing to everyone who opens its link, crawlers included, and each language has its own
 * prerendered page for search engines to index.
 */
export type Locale = "fr" | "en";

export const LOCALES: readonly Locale[] = ["fr", "en"];

/** The pages that exist in both languages, by their address in each. */
export const PAGE_PATHS = {
  home: { fr: "/", en: "/en/" },
  map: { fr: "/carte/", en: "/en/map/" },
  legal: { fr: "/mentions-legales/", en: "/en/legal-notice/" },
  privacy: { fr: "/confidentialite/", en: "/en/privacy/" },
  allergensOnlineNote: { fr: "/notes/allergenes-en-ligne/", en: "/en/notes/allergens-online/" },
} as const;

export type PageKey = keyof typeof PAGE_PATHS;

export function pagePath(page: PageKey, locale: Locale): string {
  return PAGE_PATHS[page][locale];
}

/** Restaurants keep their slug in both languages: it is the restaurant's name, not French prose. */
export function restaurantPath(slug: string, locale: Locale): string {
  return locale === "en" ? `/en/restaurant/${slug}/` : `/restaurant/${slug}/`;
}

/** `pathname` as React Router gives it, relative to the base path. */
export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

function withTrailingSlash(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/**
 * The same page in the other language, for the language switch and the hreflang links. A page
 * that only exists in one language (an unknown address) falls back to the other home page.
 */
export function equivalentPath(pathname: string, target: Locale): string {
  const path = withTrailingSlash(pathname);
  for (const paths of Object.values(PAGE_PATHS)) {
    if (path === paths.fr || path === paths.en) return paths[target];
  }
  const restaurant = /^(?:\/en)?\/restaurant\/([^/]+)\/$/.exec(path);
  if (restaurant?.[1]) return restaurantPath(restaurant[1], target);
  return PAGE_PATHS.home[target];
}
