import type { Page } from "@playwright/test";
import type { Menu } from "../../src/data/types";
import type { Restaurant } from "../../src/data/schemas";
import { makeAllergenMap } from "../fixtures/menu.fixture";

const COMPTOIR_VEGETAL_MENU: Menu = {
  menuId: "menu-comptoir-vegetal",
  restaurantId: "rest-comptoir-vegetal",
  categories: [
    {
      category: "Plats",
      dishes: [
        {
          id: "cv-p1",
          name: "Curry de lentilles corail (végane)",
          price: 14,
          tags: ["vegetarien", "vegan"],
          allergens: makeAllergenMap({ celeri: "present" }),
        },
      ],
    },
    {
      category: "Desserts",
      dishes: [
        {
          id: "cv-d1",
          name: "Mousse au chocolat végane",
          tags: ["vegetarien", "vegan"],
          allergens: makeAllergenMap({ soja: "present", fruits_a_coque: "may_contain" }),
        },
      ],
    },
  ],
};

const RESTAURANTS: Restaurant[] = [
  {
    id: "rest-comptoir-vegetal",
    name: "Le Comptoir Végétal",
    slug: "le-comptoir-vegetal",
    address: "1 rue de Test",
    postalCode: "75002",
    city: "Paris",
    latitude: 48.8677,
    longitude: 2.3419,
    cuisineTypes: ["Végane"],
    vegetarianOptions: true,
    veganOptions: true,
    allergenInformationAvailable: true,
    source: { label: "Fiche sur demande", kind: "on_request" },
    menuId: COMPTOIR_VEGETAL_MENU.menuId,
    isDemoData: true,
  },
  {
    id: "rest-comptoir-kessel",
    name: "Comptoir Kessel",
    slug: "comptoir-kessel",
    address: "2 rue de Test",
    postalCode: "75003",
    city: "Paris",
    latitude: 48.8629,
    longitude: 2.3628,
    cuisineTypes: ["Brasserie"],
    vegetarianOptions: true,
    veganOptions: false,
    allergenInformationAvailable: true,
    source: {
      label: "Fiche allergènes de l'établissement",
      url: "https://example.com/allergenes.pdf",
      kind: "published",
    },
    isDemoData: true,
  },
  {
    id: "rest-bistrot-bievre",
    name: "Bistrot de la Bièvre",
    slug: "bistrot-de-la-bievre",
    address: "3 rue de Test",
    postalCode: "75005",
    city: "Paris",
    latitude: 48.8448,
    longitude: 2.3517,
    cuisineTypes: ["Bistrot"],
    vegetarianOptions: false,
    veganOptions: false,
    allergenInformationAvailable: false,
    isDemoData: true,
  },
];

/**
 * Serves these fictional records in place of public/data, the way disableGoogleMaps pins
 * config.json. The published restaurants change with every import, and a journey that names
 * them fails as soon as one leaves, as it did when the demo records were replaced; each record
 * here stands for a case the site must get right, not for a restaurant.
 */
export async function serveFixtureData(page: Page): Promise<void> {
  await page.route("**/data/restaurants.json", async (route) => {
    await route.fulfill({ json: RESTAURANTS });
  });
  await page.route(`**/data/menus/${COMPTOIR_VEGETAL_MENU.menuId}.json`, async (route) => {
    await route.fulfill({ json: COMPTOIR_VEGETAL_MENU });
  });
}
