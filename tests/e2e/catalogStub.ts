import type { Page } from "@playwright/test";
import type { Menu, RestaurantWithMenu } from "../../src/data/types";
import { fullInfoMenu, makeAllergenMap } from "../fixtures/menu.fixture";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../fixtures/restaurants.fixture";

// The list and the map live at /carte; "/" is the landing page.
export const MAP_PATH = "/carte";

// fullInfoMenu prices every dish and tags none; the journey also needs a dish that carries a
// diet tag and has no published price.
const journeyMenu: Menu = {
  ...fullInfoMenu,
  categories: [
    ...fullInfoMenu.categories,
    {
      category: "Plats du marché",
      dishes: [
        {
          id: "dish-tagged-unpriced",
          name: "Curry de légumes",
          tags: ["vegan"],
          allergens: makeAllergenMap(),
        },
      ],
    },
  ],
};

export const restaurantWithJourneyMenu: RestaurantWithMenu = {
  ...restaurantWithFullInfo,
  menu: journeyMenu,
};

// Publishes an allergen sheet, but with no dish-by-dish transcription here.
export const restaurantPublishingElsewhere: RestaurantWithMenu = {
  ...restaurantWithFullInfo,
  id: "rest-published-elsewhere",
  name: "La Table Renvoyée",
  slug: "la-table-renvoyee",
  menuId: undefined,
  menu: undefined,
};

export { restaurantWithoutAllergenInfo };

const CATALOG = [
  restaurantWithJourneyMenu,
  restaurantPublishingElsewhere,
  restaurantWithoutAllergenInfo,
];

/**
 * This app ships with public/config.json { googleMapsEnabled: true }, and a developer running
 * the suite locally usually has a real key in .env — which would make the map legitimately
 * load and any "zero billable calls" assertion depend on who runs the tests. Intercepting
 * config.json pins the disabled path for tests that don't exercise the map itself; the
 * committed file is untouched.
 */
export async function disableGoogleMaps(page: Page): Promise<void> {
  await page.route("**/config.json", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ googleMapsEnabled: false }),
    });
  });
}

/**
 * public/data holds the reviewed catalog, and restaurants join and leave it every week: a test
 * naming one of them breaks the day it is withdrawn, and says nothing about the site when it
 * does. Intercepting the data pins what these tests read; the committed files are untouched.
 */
export async function stubCatalog(page: Page): Promise<void> {
  await page.route("**/data/restaurants.json", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      // On disk a menu is a file of its own: `menu` is what DataProvider joins on after loading.
      body: JSON.stringify(CATALOG.map((restaurant) => ({ ...restaurant, menu: undefined }))),
    });
  });
  for (const { menu } of CATALOG) {
    if (!menu) continue;
    await page.route(`**/data/menus/${menu.menuId}.json`, async (route) => {
      await route.fulfill({ contentType: "application/json", body: JSON.stringify(menu) });
    });
  }
}
