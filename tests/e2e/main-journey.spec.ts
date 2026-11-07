import { expect, test, type Page } from "@playwright/test";
import type { Menu, RestaurantWithMenu } from "../../src/data/types";
import { fullInfoMenu, makeAllergenMap } from "../fixtures/menu.fixture";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../fixtures/restaurants.fixture";
import { installGoogleMapsRequestGuard } from "../mocks/googleMapsScriptMock";

// The list and the map live at /carte; "/" is the landing page.
const MAP_PATH = "/carte";

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

const restaurantWithJourneyMenu: RestaurantWithMenu = {
  ...restaurantWithFullInfo,
  menu: journeyMenu,
};

// Publishes an allergen sheet, but with no dish-by-dish transcription here.
const restaurantPublishingElsewhere: RestaurantWithMenu = {
  ...restaurantWithFullInfo,
  id: "rest-published-elsewhere",
  name: "La Table Renvoyée",
  slug: "la-table-renvoyee",
  menuId: undefined,
  menu: undefined,
};

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
async function disableGoogleMaps(page: Page): Promise<void> {
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
async function stubCatalog(page: Page): Promise<void> {
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

test("browse the list, open a restaurant and see allergen info — no real Maps call", async ({
  page,
}) => {
  await disableGoogleMaps(page);
  await stubCatalog(page);
  const mapsGuard = await installGoogleMapsRequestGuard(page);

  await page.goto(MAP_PATH);
  // The text box searches addresses to move the map; the list itself is filtered by the map's
  // visible area, so there is no name search to exercise here.
  const { name } = restaurantWithJourneyMenu;
  await expect(page.getByRole("link", { name })).toBeVisible();

  await page.getByRole("link", { name }).click();

  await expect(page.getByRole("heading", { name })).toBeVisible();
  await expect(page.getByText(/informations présentées sont indicatives/i)).toBeVisible();
  await expect(page.getByText("Curry de légumes")).toBeVisible();

  // Diet labels are shown as tags, and only for végétarien / végan — "sans gluten" and
  // "sans lactose" are allergen claims and belong to the allergen data, not to a tag.
  await expect(page.getByText("Végan", { exact: true })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Sans gluten");

  // A dish the source prices is shown with its price; one it does not is shown without,
  // rather than with a 0,00 € the operator never published.
  await expect(page.getByText("12.00 €")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("0.00 €");

  expect(mapsGuard.wasRequested()).toBe(false);
});

test("a restaurant that publishes allergens elsewhere is not reported as having none", async ({
  page,
}) => {
  await disableGoogleMaps(page);
  await stubCatalog(page);
  await installGoogleMapsRequestGuard(page);

  // The page must point at the sheet rather than claim no information exists — the two are very
  // different things to tell someone deciding where to eat.
  await page.goto(`/restaurant/${restaurantPublishingElsewhere.slug}`);

  await expect(
    page.getByRole("heading", { name: restaurantPublishingElsewhere.name }),
  ).toBeVisible();
  await expect(page.getByText(/publie ses informations allergènes/i)).toBeVisible();
  await expect(page.getByText(/aucune information sur les allergènes/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /la source publiée/i })).toBeVisible();
});

test("a restaurant with no allergen source at all says so plainly", async ({ page }) => {
  await disableGoogleMaps(page);
  await stubCatalog(page);
  await installGoogleMapsRequestGuard(page);

  await page.goto(`/restaurant/${restaurantWithoutAllergenInfo.slug}`);

  await expect(
    page.getByRole("heading", { name: restaurantWithoutAllergenInfo.name }),
  ).toBeVisible();
  await expect(page.getByText(/aucune information sur les allergènes/i)).toBeVisible();
  // The reassuring message from the previous test must not appear here: there is no source
  // to send anyone to.
  await expect(page.getByText(/publie ses informations allergènes/i)).toHaveCount(0);
});

test("selecting an allergen to avoid never labels a restaurant as safe", async ({ page }) => {
  await disableGoogleMaps(page);
  await stubCatalog(page);
  await installGoogleMapsRequestGuard(page);
  await page.goto(MAP_PATH);

  // The checkbox is sr-only behind a styled pill, so a plain click lands on the emoji instead.
  await page.getByRole("checkbox", { name: "Gluten" }).check({ force: true });

  // The card has taken the filter into account: what follows is about a list that reacted.
  await expect(page.getByText("2 plats sur 3 ne déclarent pas l’allergène à éviter")).toBeVisible();

  await expect(page.locator("body")).not.toContainText(/\bsafe\b/i);
  await expect(page.locator("body")).not.toContainText("sûr");
  await expect(page.locator("body")).not.toContainText("sans risque");
});

test("the restaurant list stays usable when Google Maps is disabled", async ({ page }) => {
  await disableGoogleMaps(page);
  await stubCatalog(page);
  const mapsGuard = await installGoogleMapsRequestGuard(page);

  await page.goto(MAP_PATH);

  await expect(page.getByText(/carte temporairement indisponible/i)).toBeVisible();
  await expect(page.getByRole("link", { name: restaurantWithJourneyMenu.name })).toBeVisible();
  expect(mapsGuard.wasRequested()).toBe(false);
});
