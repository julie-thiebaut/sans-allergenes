import { expect, test } from "@playwright/test";
import { installGoogleMapsRequestGuard } from "../mocks/googleMapsScriptMock";

test("search, filter, open a restaurant and see allergen info — no real Maps call", async ({
  page,
}) => {
  const mapsGuard = await installGoogleMapsRequestGuard(page);

  await page.goto("/");
  await expect(page.getByRole("link", { name: /le petit basilic/i })).toBeVisible();

  await page.getByLabel(/rechercher par nom, adresse ou type de cuisine/i).fill("basilic");
  await expect(page.getByRole("link", { name: /le petit basilic/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /or et sésame/i })).toHaveCount(0);

  await page.getByRole("link", { name: /le petit basilic/i }).click();

  await expect(page.getByRole("heading", { name: /le petit basilic/i })).toBeVisible();
  await expect(page.getByText(/informations présentées sont indicatives/i)).toBeVisible();
  await expect(page.getByText("Bruschetta tomate-basilic")).toBeVisible();

  expect(mapsGuard.wasRequested()).toBe(false);
});

test("selecting an allergen to avoid never labels a restaurant as safe", async ({ page }) => {
  await installGoogleMapsRequestGuard(page);
  await page.goto("/");

  await page.getByRole("checkbox", { name: "Gluten" }).click();

  await expect(page.getByRole("main").or(page.locator("body"))).not.toContainText(/\bsafe\b/i);
  await expect(page.locator("body")).not.toContainText("sûr");
  await expect(page.locator("body")).not.toContainText("sans risque");
});

test("the restaurant list stays usable when Google Maps is disabled", async ({ page }) => {
  // This app ships with public/config.json { googleMapsEnabled: true } by default, so this
  // test flips it for the duration of the run by intercepting the config.json request —
  // it does not modify the committed file.
  await page.route("**/config.json", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ googleMapsEnabled: false }),
    });
  });
  const mapsGuard = await installGoogleMapsRequestGuard(page);

  await page.goto("/");

  await expect(page.getByText(/carte temporairement indisponible/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /le petit basilic/i })).toBeVisible();
  expect(mapsGuard.wasRequested()).toBe(false);
});
