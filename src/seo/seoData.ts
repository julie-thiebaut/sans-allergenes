import type { Restaurant } from "../data/types";

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "Sans Allergènes";

/** The landing page at `/` — explains the project; the map itself lives at `/carte/`. */
export function buildHomeMeta(siteUrl: string): PageMeta {
  return {
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
    title: `La carte des restaurants · ${SITE_NAME}`,
    description:
      "Parcourez la carte des restaurants et consultez les informations disponibles sur les allergènes de leurs plats.",
    canonical: `${siteUrl.replace(/\/$/, "")}/carte/`,
  };
}

export function buildRestaurantMeta(restaurant: Restaurant, siteUrl: string): PageMeta {
  const canonical = `${siteUrl.replace(/\/$/, "")}/restaurant/${restaurant.slug}/`;
  const primaryCuisine = restaurant.cuisineTypes[0] ?? "Restaurant";
  const title = `${restaurant.name} · ${primaryCuisine} à ${restaurant.city} | ${SITE_NAME}`;
  const description =
    restaurant.description ??
    `Informations sur les allergènes pour ${restaurant.name}, ${restaurant.cuisineTypes.join(", ")} à ${restaurant.city}.`;

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
    url: canonical,
  };
  if (restaurant.priceLevel) {
    jsonLd.priceRange = "€".repeat(restaurant.priceLevel);
  }

  return { title, description, canonical, ogImage: restaurant.imageUrl, jsonLd };
}
