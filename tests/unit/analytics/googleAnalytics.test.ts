import { beforeEach, describe, expect, it } from "vitest";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  readAnalyticsConsent,
  sanitizedAnalyticsLocation,
  storeAnalyticsConsent,
} from "../../../src/analytics/googleAnalytics";

describe("Google Analytics privacy helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("removes every query parameter and fragment from measured page locations", () => {
    expect(
      sanitizedAnalyticsLocation(
        "https://sans-allergenes.fr/carte?avoid=gluten%2Cmilk&vegan=1#results",
      ),
    ).toBe("https://sans-allergenes.fr/carte");
  });

  it("stores and reads an explicit consent choice", () => {
    storeAnalyticsConsent("accepted", 1_000);

    expect(readAnalyticsConsent(2_000)).toBe("accepted");
  });

  it("forgets an expired consent choice", () => {
    window.localStorage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      JSON.stringify({ choice: "refused", expiresAt: 999 }),
    );

    expect(readAnalyticsConsent(1_000)).toBeNull();
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBeNull();
  });
});
