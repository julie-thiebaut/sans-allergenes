import type { Restaurant } from "../data/types";
import { cuisineLabels } from "../utils/cuisineLine";

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageType?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "Sans Allergènes";

/** The one share image, on every page. Rendered by scripts/generate-share-image.ts. */
function shareImage(siteUrl: string): Partial<PageMeta> {
  return {
    ogImage: `${siteUrl.replace(/\/$/, "")}/og-image.png`,
    ogImageAlt: "Sans Allergènes : les allergènes déclarés par les restaurants, plat par plat.",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: "image/png",
  };
}

/** The landing page at `/` — explains the project; the map itself lives at `/carte/`. */
export function buildHomeMeta(siteUrl: string): PageMeta {
  return {
    ...shareImage(siteUrl),
    // No city named here on purpose: the coverage area is meant to grow, and a title that
    // pins the site to one city would have to be re-indexed the day it does.
    title: `${SITE_NAME} · Trouvez où manger sans allergènes`,
    description:
      "Consultez les 14 allergènes réglementaires déclarés pour chaque plat, et filtrez la carte selon les allergènes que vous évitez.",
    canonical: siteUrl,
  };
}

export function buildMapMeta(siteUrl: string): PageMeta {
  return {
    ...shareImage(siteUrl),
    title: `La carte des restaurants · ${SITE_NAME}`,
    description:
      "Parcourez la carte des restaurants et consultez les informations disponibles sur les allergènes de leurs plats.",
    canonical: `${siteUrl.replace(/\/$/, "")}/carte/`,
  };
}

export function buildLegalMeta(siteUrl: string): PageMeta {
  return {
    ...shareImage(siteUrl),
    title: "Mentions légales et conditions d’utilisation · " + SITE_NAME,
    description:
      "Mentions légales, hébergement et conditions d’utilisation du service Sans Allergènes.",
    canonical: siteUrl.replace(/\/$/, "") + "/mentions-legales/",
  };
}

export function buildPrivacyMeta(siteUrl: string): PageMeta {
  return {
    ...shareImage(siteUrl),
    title: "Confidentialité et cookies · " + SITE_NAME,
    description:
      "Politique de confidentialité et informations sur les cookies et services tiers utilisés par Sans Allergènes.",
    canonical: siteUrl.replace(/\/$/, "") + "/confidentialite/",
  };
}

/** Shared by the note, its search metadata and its teaser on the landing page. */
export const ALLERGENS_ONLINE_NOTE_TITLE =
  "Allergènes au restaurant : ce que dit la loi, ce que l’on trouve en ligne";
/** The note's date, shown under its title and given to search engines as its publication date. */
export const ALLERGENS_ONLINE_NOTE_DATE = "2026-10-08";
/** Written out rather than formatted from the ISO date, which would shift a day west of Paris. */
export const ALLERGENS_ONLINE_NOTE_DATE_LABEL = "8 octobre 2026";

export function buildAllergensOnlineNoteMeta(siteUrl: string): PageMeta {
  const title = ALLERGENS_ONLINE_NOTE_TITLE;
  const canonical = siteUrl.replace(/\/$/, "") + "/notes/allergenes-en-ligne/";
  return {
    ...shareImage(siteUrl),
    title: `${title} · ${SITE_NAME}`,
    description:
      "Ce que la loi impose aux restaurants sur les allergènes, ce que constatent les contrôles de la DGCCRF, et ce que l’on trouve sur plus de 7 200 sites de restaurants parisiens.",
    canonical,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      datePublished: ALLERGENS_ONLINE_NOTE_DATE,
      author: { "@type": "Person", name: "Julie Thiebaut" },
      inLanguage: "fr",
      url: canonical,
    },
  };
}

/**
 * Le titre d'une fiche, tel qu'il s'affiche dans un résultat de recherche ou un résumé d'IA. Il ne
 * porte pas le nom du site : « 211 · Bar à Paris | Sans Allergènes » se lit comme une promesse sur
 * ce restaurant, même quand sa fiche n'a aucune information. Une enseigne présente à plusieurs
 * adresses se distingue par la sienne, sinon toutes ses fiches auraient le même titre.
 */
function restaurantTitle(restaurant: Restaurant, catalog: readonly Restaurant[]): string {
  const name = restaurant.name.trim().toLowerCase();
  const nameIsShared = catalog.some(
    (other) => other.id !== restaurant.id && other.name.trim().toLowerCase() === name,
  );
  const topic = restaurant.allergenInformationAvailable
    ? "allergènes de la carte"
    : "allergènes non publiés";

  if (nameIsShared) return `${restaurant.name}, ${restaurant.address} : ${topic}`;
  return restaurant.allergenInformationAvailable
    ? `${restaurant.name} : ${topic} (${restaurant.city})`
    : `${restaurant.name} (${restaurant.city}) : ${topic}`;
}

export function buildRestaurantMeta(
  restaurant: Restaurant,
  siteUrl: string,
  catalog: readonly Restaurant[],
): PageMeta {
  const canonical = `${siteUrl.replace(/\/$/, "")}/restaurant/${restaurant.slug}/`;
  const title = restaurantTitle(restaurant, catalog);
  // Une fiche sans allergènes ne doit pas s'annoncer comme leur source dans un résultat de
  // recherche : elle dit ce qui manque, et ce qu'on peut y faire.
  const description =
    restaurant.description ??
    (restaurant.allergenInformationAvailable
      ? `Informations sur les allergènes pour ${restaurant.name}, ${cuisineLabels(restaurant.cuisineTypes)} à ${restaurant.city}.`
      : `${restaurant.name} ne publie pas les allergènes de ses plats en ligne. Demandez-lui de publier sa liste.`);

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
    mainEntityOfPage: canonical,
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

  return { ...shareImage(siteUrl), title, description, canonical, jsonLd };
}
