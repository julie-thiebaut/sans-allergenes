import { expect, test, type Page } from "@playwright/test";
import { installGoogleMapsRequestGuard } from "../mocks/googleMapsScriptMock";

// The list and the map live at /carte; "/" is the landing page.
const MAP_PATH = "/carte";

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

test("browse the list, open a restaurant and see allergen info — no real Maps call", async ({
  page,
}) => {
  await disableGoogleMaps(page);
  const mapsGuard = await installGoogleMapsRequestGuard(page);

  await page.goto(MAP_PATH);
  // The text box searches addresses to move the map; the list itself is filtered by the map's
  // visible area, so there is no name search to exercise here.
  await expect(page.getByRole("link", { name: /le comptoir végétal/i })).toBeVisible();

  await page.getByRole("link", { name: /le comptoir végétal/i }).click();

  await expect(page.getByRole("heading", { name: /le comptoir végétal/i })).toBeVisible();
  await expect(page.getByText(/informations présentées sont indicatives/i)).toBeVisible();
  await expect(page.getByText("Curry de lentilles corail (végane)")).toBeVisible();

  // Diet labels are shown as tags, and only for végétarien / végan — "sans gluten" and
  // "sans lactose" are allergen claims and belong to the allergen data, not to a tag.
  await expect(page.getByText("Végan").first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Sans gluten");

  // A dish the source prices is shown with its price; one it does not is shown without,
  // rather than with a 0,00 € the operator never published.
  await expect(page.getByText("14.00 €")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("0.00 €");

  expect(mapsGuard.wasRequested()).toBe(false);
});

test("a restaurant that publishes allergens elsewhere is not reported as having none", async ({
  page,
}) => {
  await disableGoogleMaps(page);
  await installGoogleMapsRequestGuard(page);

  // Publishes an allergen sheet, but with no dish-by-dish transcription here. The page must
  // point at that source rather than claim no information exists — the two are very different
  // things to tell someone deciding where to eat.
  await page.goto("/restaurant/comptoir-kessel");

  await expect(page.getByRole("heading", { name: /comptoir kessel/i })).toBeVisible();
  await expect(page.getByText(/publie ses informations allergènes/i)).toBeVisible();
  await expect(page.getByText(/aucune information sur les allergènes/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /la source publiée/i })).toBeVisible();
});

test("a restaurant with no allergen source at all says so plainly", async ({ page }) => {
  await disableGoogleMaps(page);
  await installGoogleMapsRequestGuard(page);

  await page.goto("/restaurant/bistrot-de-la-bievre");

  await expect(page.getByRole("heading", { name: /bistrot de la bièvre/i })).toBeVisible();
  await expect(page.getByText(/aucune information sur les allergènes/i)).toBeVisible();
  // The reassuring message from the previous test must not appear here: there is no source
  // to send anyone to.
  await expect(page.getByText(/publie ses informations allergènes/i)).toHaveCount(0);
});

test("selecting an allergen to avoid never labels a restaurant as safe", async ({ page }) => {
  await disableGoogleMaps(page);
  await installGoogleMapsRequestGuard(page);
  await page.goto(MAP_PATH);

  // The checkbox is sr-only behind a styled pill, so a plain click lands on the emoji instead.
  await page.getByRole("checkbox", { name: "Gluten" }).check({ force: true });

  await expect(page.locator("body")).not.toContainText(/\bsafe\b/i);
  await expect(page.locator("body")).not.toContainText("sûr");
  await expect(page.locator("body")).not.toContainText("sans risque");
});

test("the restaurant list stays usable when Google Maps is disabled", async ({ page }) => {
  await disableGoogleMaps(page);
  const mapsGuard = await installGoogleMapsRequestGuard(page);

  await page.goto(MAP_PATH);

  await expect(page.getByText(/carte temporairement indisponible/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /le comptoir végétal/i })).toBeVisible();
  expect(mapsGuard.wasRequested()).toBe(false);
});
