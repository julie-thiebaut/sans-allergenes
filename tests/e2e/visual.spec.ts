import { expect, test, type Page } from "@playwright/test";
import { ANALYTICS_CONSENT_STORAGE_KEY } from "../../src/analytics/googleAnalytics";
import { installGoogleMapsRequestGuard } from "../mocks/googleMapsScriptMock";
import { MAP_PATH, disableGoogleMaps, restaurantWithJourneyMenu, stubCatalog } from "./catalogStub";

/**
 * Visual comparisons: each test compares a full-page capture with a reference image kept next to
 * this file. Neither the typecheck nor the other tests see a layout that breaks (a dependency
 * update once made icons huge and shifted spacing with every text still in place); these do.
 *
 * After an intended design change, regenerate the references with
 *   npx playwright test visual --update-snapshots
 * and look at the new images before committing them. Font rendering differs between systems,
 * so the references are per platform (the file name ends in -win32).
 */

async function preparePage(page: Page): Promise<void> {
  // The footer prints the current year: a fixed clock keeps the capture the same in January.
  await page.clock.setFixedTime(new Date("2026-06-15T12:00:00+02:00"));
  // The consent banner shows only when analytics is configured, which depends on who builds:
  // a stored refusal keeps it out of every capture.
  await page.addInitScript(([key, value]) => window.localStorage.setItem(key, value), [
    ANALYTICS_CONSENT_STORAGE_KEY,
    JSON.stringify({ choice: "refused", expiresAt: Date.UTC(2100, 0, 1) }),
  ] as const);
  await disableGoogleMaps(page);
  await stubCatalog(page);
  await installGoogleMapsRequestGuard(page);
}

async function openRestaurantList(page: Page): Promise<void> {
  await page.goto(MAP_PATH);
  await expect(page.getByRole("link", { name: restaurantWithJourneyMenu.name })).toBeVisible();
}

async function openRestaurantPage(page: Page): Promise<void> {
  await page.goto(`/restaurant/${restaurantWithJourneyMenu.slug}`);
  await expect(page.getByText("Curry de légumes")).toBeVisible();
}

/**
 * The site keeps its header and footer in place and scrolls the content inside an inner panel,
 * so a "full page" capture stops at the window and cuts the menu off. Growing the window by what
 * the tallest panel hides lays everything out at once before the capture.
 */
async function expectWholePage(page: Page, name: string): Promise<void> {
  const hidden = await page.evaluate(() => {
    let most = 0;
    for (const element of document.querySelectorAll("*")) {
      if (!/(auto|scroll)/.test(getComputedStyle(element).overflowY)) continue;
      most = Math.max(most, element.scrollHeight - element.clientHeight);
    }
    return most;
  });
  const viewport = page.viewportSize();
  if (viewport && hidden > 0) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height + hidden });
  }
  await expect(page).toHaveScreenshot(name, { fullPage: true });
}

test.describe("desktop", () => {
  test.beforeEach(async ({ page }) => preparePage(page));

  test("landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectWholePage(page, "accueil.png");
  });

  test("restaurant list", async ({ page }) => {
    await openRestaurantList(page);
    await expectWholePage(page, "liste.png");
  });

  test("restaurant list with an allergen to avoid", async ({ page }) => {
    await openRestaurantList(page);
    await page.getByRole("checkbox", { name: "Gluten" }).check({ force: true });
    await expect(
      page.getByText("2 plats sur 3 ne déclarent pas l’allergène à éviter"),
    ).toBeVisible();
    await expectWholePage(page, "liste-filtre-gluten.png");
  });

  test("restaurant page", async ({ page }) => {
    await openRestaurantPage(page);
    await expectWholePage(page, "fiche.png");
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test.beforeEach(async ({ page }) => preparePage(page));

  test("restaurant list", async ({ page }) => {
    // On a phone /carte opens on the map: the list is one tap away.
    await page.goto(MAP_PATH);
    await page.getByRole("button", { name: "Liste", exact: true }).click();
    await expect(page.getByRole("link", { name: restaurantWithJourneyMenu.name })).toBeVisible();
    await expectWholePage(page, "liste-telephone.png");
  });

  test("restaurant page", async ({ page }) => {
    await openRestaurantPage(page);
    await expectWholePage(page, "fiche-telephone.png");
  });
});
