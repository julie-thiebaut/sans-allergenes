import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  readAnalyticsConsent,
  sanitizedAnalyticsLocation,
  storeAnalyticsConsent,
  trackEvent,
} from "../../../src/analytics/googleAnalytics";

describe("trackEvent", () => {
  const target = window as Window & { gtag?: (...args: unknown[]) => void };

  beforeEach(() => {
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_GOOGLE_ANALYTICS_ID", "G-TEST123");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete target.gtag;
  });

  it("sends the event by its name alone, with no parameter", () => {
    target.gtag = vi.fn();

    trackEvent("ask_to_publish");

    expect(target.gtag).toHaveBeenCalledExactlyOnceWith("event", "ask_to_publish");
  });

  it("sends nothing before consent, when gtag was never set up", () => {
    expect(() => trackEvent("report_problem")).not.toThrow();
  });

  it("sends nothing outside the production build", () => {
    vi.stubEnv("PROD", false);
    target.gtag = vi.fn();

    trackEvent("call_restaurant");

    expect(target.gtag).not.toHaveBeenCalled();
  });
});

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
