import type { Page } from "@playwright/test";

export interface GoogleMapsGuard {
  wasRequested(): boolean;
}

/**
 * Belt-and-braces network guard for e2e tests: aborts any request that would reach Google's
 * real Maps servers and records whether it happened, so a test can assert zero billable calls
 * even if a future change accidentally reintroduces one. In this app it should never fire —
 * GoogleMapsAdapter itself never loads without a real API key, and it's simply never imported
 * on the disabled path.
 */
export async function installGoogleMapsRequestGuard(page: Page): Promise<GoogleMapsGuard> {
  let requested = false;
  await page.route("**://maps.googleapis.com/**", async (route) => {
    requested = true;
    await route.abort("blockedbyclient");
  });
  return { wasRequested: () => requested };
}
