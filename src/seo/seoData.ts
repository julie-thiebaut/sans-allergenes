import type { Restaurant } from "../data/types";

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "Sans Allergènes";

export function buildHomeMeta(siteUrl: string): PageMeta {
  return {
    title: `${SITE_NAME} — Restaurants à Paris et informations allergènes`,
    description:
      "Trouvez des restaurants à Paris et consultez les informations disponibles sur les allergènes de leurs plats.",
    canonical: siteUrl,
  };
}

export function buildRestaurantMeta(restaurant: Restaurant, siteUrl: string): PageMeta {
  const canonical = `${siteUrl.replace(/\/$/, "")}/restaurant/${restaurant.slug}/`;
  const primaryCuisine = restaurant.cuisineTypes[0] ?? "Restaurant";
  const title = `${restaurant.name} — ${primaryCuisine} à ${restaurant.city} | ${SITE_NAME}`;
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
