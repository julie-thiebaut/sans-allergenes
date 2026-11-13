import type { Restaurant } from "../data/types";
import { localizeText, type ContentTranslationFile } from "../i18n/contentTranslation";
import { LOCALES, pagePath, restaurantPath, type Locale, type PageKey } from "../i18n/locale";
import { MESSAGES } from "../i18n/messages";
import { cuisineLabels } from "../utils/cuisineLine";

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  /** The page's language, for `og:locale` and `<html lang>`. */
  locale: Locale;
  /** The same page in every language, for the hreflang links. */
  alternates: Record<Locale, string>;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageType?: string;
  jsonLd?: Record<string, unknown>;
}

export const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };

function siteRoot(siteUrl: string): string {
  return siteUrl.replace(/\/$/, "");
}

/** The one share image, on every page. Rendered by scripts/generate-share-image.ts. */
function shareImage(siteUrl: string, locale: Locale): Partial<PageMeta> {
  return {
    ogImage: `${siteRoot(siteUrl)}/og-image.png`,
    ogImageAlt: MESSAGES[locale].seo.shareImageAlt,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: "image/png",
  };
}

function languageVersions(
  siteUrl: string,
  locale: Locale,
  pathIn: (locale: Locale) => string,
): Pick<PageMeta, "canonical" | "locale" | "alternates"> {
  const alternates = Object.fromEntries(
    LOCALES.map((each) => [each, `${siteRoot(siteUrl)}${pathIn(each)}`]),
  ) as Record<Locale, string>;
  return { canonical: alternates[locale], locale, alternates };
}

function pageVersions(siteUrl: string, page: PageKey, locale: Locale) {
  return languageVersions(siteUrl, locale, (each) => pagePath(page, each));
}

/** The landing page at `/` — explains the project; the map itself lives at `/carte/`. */
export function buildHomeMeta(siteUrl: string, locale: Locale = "fr"): PageMeta {
  const seo = MESSAGES[locale].seo;
  return {
    ...shareImage(siteUrl, locale),
    // No city named here on purpose: the coverage area is meant to grow, and a title that
    // pins the site to one city would have to be re-indexed the day it does.
    // Not the page's heading: this is what a search result, a tab or a shared link shows, so it
    // names what the site finds ("un restaurant") in the words of the person searching.
    title: seo.homeTitle,
    description: seo.homeDescription,
    ...pageVersions(siteUrl, "home", locale),
  };
}

export function buildMapMeta(siteUrl: string, locale: Locale = "fr"): PageMeta {
  const seo = MESSAGES[locale].seo;
  return {
    ...shareImage(siteUrl, locale),
    title: seo.mapTitle,
    description: seo.mapDescription,
    ...pageVersions(siteUrl, "map", locale),
  };
}

export function buildLegalMeta(siteUrl: string, locale: Locale = "fr"): PageMeta {
  const seo = MESSAGES[locale].seo;
  return {
    ...shareImage(siteUrl, locale),
    title: seo.legalTitle,
    description: seo.legalDescription,
    ...pageVersions(siteUrl, "legal", locale),
  };
}

export function buildPrivacyMeta(siteUrl: string, locale: Locale = "fr"): PageMeta {
  const seo = MESSAGES[locale].seo;
  return {
    ...shareImage(siteUrl, locale),
    title: seo.privacyTitle,
    description: seo.privacyDescription,
    ...pageVersions(siteUrl, "privacy", locale),
  };
}

/** Shared by the note, its search metadata and its teaser on the landing page. */
export const ALLERGENS_ONLINE_NOTE_TITLE = MESSAGES.fr.seo.noteTitle;
/** The note's date, shown under its title and given to search engines as its publication date. */
export const ALLERGENS_ONLINE_NOTE_DATE = "2026-10-08";
/** Written out rather than formatted from the ISO date, which would shift a day west of Paris. */
export const ALLERGENS_ONLINE_NOTE_DATE_LABEL = MESSAGES.fr.seo.noteDateLabel;

export function buildAllergensOnlineNoteMeta(siteUrl: string, locale: Locale = "fr"): PageMeta {
  const seo = MESSAGES[locale].seo;
  const title = seo.noteTitle;
  const versions = pageVersions(siteUrl, "allergensOnlineNote", locale);
  return {
    ...shareImage(siteUrl, locale),
    title: `${title} · ${MESSAGES[locale].siteName}`,
    description: seo.noteDescription,
    ...versions,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      datePublished: ALLERGENS_ONLINE_NOTE_DATE,
      author: { "@type": "Person", name: "Julie Thiebaut" },
      inLanguage: locale,
      url: versions.canonical,
      // The English page is a translation of the French note, which stays the original.
      ...(locale === "en"
        ? {
            translationOfWork: {
              "@type": "Article",
              url: versions.alternates.fr,
              inLanguage: "fr",
            },
          }
        : {}),
    },
  };
}

/**
 * Le titre d'une fiche, tel qu'il s'affiche dans un résultat de recherche ou un résumé d'IA. Il ne
 * porte pas le nom du site : « 211 · Bar à Paris | Sans Allergènes » se lit comme une promesse sur
 * ce restaurant, même quand sa fiche n'a aucune information. Une enseigne présente à plusieurs
 * adresses se distingue par la sienne, sinon toutes ses fiches auraient le même titre.
 */
function restaurantTitle(
  restaurant: Restaurant,
  catalog: readonly Restaurant[],
  locale: Locale,
): string {
  const seo = MESSAGES[locale].seo;
  const name = restaurant.name.trim().toLowerCase();
  const nameIsShared = catalog.some(
    (other) => other.id !== restaurant.id && other.name.trim().toLowerCase() === name,
  );
  const topic = restaurant.allergenInformationAvailable
    ? seo.restaurantTopicWith
    : seo.restaurantTopicWithout;
  // A space before the colon in French, none in English.
  const colon = locale === "fr" ? " :" : ":";

  if (nameIsShared) return `${restaurant.name}, ${restaurant.address}${colon} ${topic}`;
  return restaurant.allergenInformationAvailable
    ? `${restaurant.name}${colon} ${topic} (${restaurant.city})`
    : `${restaurant.name} (${restaurant.city})${colon} ${topic}`;
}

export function buildRestaurantMeta(
  restaurant: Restaurant,
  siteUrl: string,
  catalog: readonly Restaurant[],
  locale: Locale = "fr",
  translations?: ContentTranslationFile,
): PageMeta {
  const seo = MESSAGES[locale].seo;
  const versions = languageVersions(siteUrl, locale, (each) =>
    restaurantPath(restaurant.slug, each),
  );
  const title = restaurantTitle(restaurant, catalog, locale);
  // Une fiche sans allergènes ne doit pas s'annoncer comme leur source dans un résultat de
  // recherche : elle dit ce qui manque, et ce qu'on peut y faire.
  const description = restaurant.description
    ? localizeText(restaurant.description, locale, translations).text
    : restaurant.allergenInformationAvailable
      ? seo.restaurantDescriptionWith(
          restaurant.name,
          cuisineLabels(restaurant.cuisineTypes, locale),
          restaurant.city,
        )
      : seo.restaurantDescriptionWithout(restaurant.name);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address,
      postalCode: restaurant.postalCode,
      addressLocality: restaurant.city,
      addressCountry: "FR",
    },
    servesCuisine: restaurant.cuisineTypes,
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    },
    // `url` désigne le restaurant, sur son propre site ; la page qui le décrit est celle-ci.
    mainEntityOfPage: versions.canonical,
  };
  if (restaurant.websiteUrl) {
    jsonLd.url = restaurant.websiteUrl;
  }
  if (restaurant.phone) {
    jsonLd.telephone = restaurant.phone;
  }
  if (restaurant.priceLevel) {
    jsonLd.priceRange = "€".repeat(restaurant.priceLevel);
  }

  return { ...shareImage(siteUrl, locale), title, description, ...versions, jsonLd };
}
