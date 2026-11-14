export type AnalyticsConsent = "accepted" | "refused";

export const ANALYTICS_CONSENT_STORAGE_KEY = "sans-allergenes:analytics-consent";

const CONSENT_DURATION_MS = 183 * 24 * 60 * 60 * 1000;
const ANALYTICS_COOKIE_DURATION_SECONDS = 395 * 24 * 60 * 60;
const GOOGLE_TAG_SCRIPT_ID = "sans-allergenes-google-analytics";

interface StoredConsent {
  choice: AnalyticsConsent;
  expiresAt: number;
}

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window &
  typeof globalThis & {
    dataLayer?: unknown[];
    gtag?: Gtag;
  } & Record<string, unknown>;

let initializationPromise: Promise<boolean> | null = null;

function measurementId(): string {
  return (import.meta.env.VITE_GOOGLE_ANALYTICS_ID ?? "").trim();
}

function isValidMeasurementId(value: string): boolean {
  return /^G-[A-Z0-9]+$/i.test(value);
}

export function isGoogleAnalyticsConfigured(): boolean {
  return isValidMeasurementId(measurementId());
}

export function isGoogleAnalyticsRuntimeAvailable(): boolean {
  if (typeof window === "undefined" || !import.meta.env.PROD) return false;
  if (new URLSearchParams(window.location.search).has("__prerender")) return false;
  return isGoogleAnalyticsConfigured();
}

export function readAnalyticsConsent(now = Date.now()): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (
      (parsed.choice !== "accepted" && parsed.choice !== "refused") ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= now
    ) {
      window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY);
      return null;
    }
    return parsed.choice;
  } catch {
    return null;
  }
}

export function storeAnalyticsConsent(choice: AnalyticsConsent, now = Date.now()): void {
  if (typeof window === "undefined") return;

  try {
    const value: StoredConsent = { choice, expiresAt: now + CONSENT_DURATION_MS };
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // A blocked storage API must not prevent the user from choosing for this visit.
  }
}

export function sanitizedAnalyticsLocation(input: string): string {
  const url = new URL(input);
  url.search = "";
  url.hash = "";
  return url.toString();
}

function analyticsWindow(): AnalyticsWindow {
  return window as AnalyticsWindow;
}

function ensureGtag(): Gtag {
  const target = analyticsWindow();
  target.dataLayer ??= [];
  // gtag.js only treats a dataLayer entry as a command when the entry is the `arguments`
  // object itself; it ignores a plain array. A rest parameter pushes an Array, so every
  // consent/js/config/event call was dropped and the property never received a single hit.
  target.gtag ??= function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag.js requires the arguments object.
    target.dataLayer?.push(arguments);
  };
  return target.gtag;
}

function deleteAnalyticsCookies(): void {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=", 1)[0]?.trim())
    .filter((name): name is string => Boolean(name?.startsWith("_ga")));

  const hostname = window.location.hostname;
  const domainCandidates = hostname ? [hostname, "." + hostname] : [];

  for (const name of cookieNames) {
    document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
    for (const domain of domainCandidates) {
      document.cookie = name + "=; Max-Age=0; path=/; domain=" + domain + "; SameSite=Lax";
    }
  }
}

export async function initializeGoogleAnalytics(): Promise<boolean> {
  if (!isGoogleAnalyticsRuntimeAvailable()) return false;
  if (initializationPromise) return initializationPromise;

  const id = measurementId();
  const target = analyticsWindow();
  target["ga-disable-" + id] = false;

  const gtag = ensureGtag();
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  gtag("js", new Date());
  gtag("config", id, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: ANALYTICS_COOKIE_DURATION_SECONDS,
    page_location: sanitizedAnalyticsLocation(window.location.href),
  });

  const existingScript = document.getElementById(GOOGLE_TAG_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript?.dataset.loaded === "true") return true;

  initializationPromise = new Promise<boolean>((resolve) => {
    const script = existingScript ?? document.createElement("script");
    script.id = GOOGLE_TAG_SCRIPT_ID;
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve(true);
    };
    script.onerror = () => {
      initializationPromise = null;
      script.remove();
      resolve(false);
    };
    if (!existingScript) document.head.appendChild(script);
  });

  return initializationPromise;
}

export function trackPageView(): void {
  if (!isGoogleAnalyticsRuntimeAvailable()) return;
  const gtag = analyticsWindow().gtag;
  if (!gtag) return;

  const pageLocation = sanitizedAnalyticsLocation(window.location.href);
  gtag("config", measurementId(), {
    update: true,
    send_page_view: false,
    page_location: pageLocation,
    page_title: document.title,
  });
  gtag("event", "page_view", {
    page_location: pageLocation,
    page_title: document.title,
  });
}

/**
 * The clicks page views cannot tell: what a visitor does with a restaurant's page, and where
 * they opened it from. One name per gesture and no parameter, so each one reads as is in the
 * Events report without registering a custom dimension; the current page, already stripped of
 * its filters, places it. Never an allergen nor a searched address: the consent banner says so.
 */
export type AnalyticsEvent =
  | "ask_to_publish" // "Écrire au restaurant", on a page without allergens
  | "ask_question" // the question to the restaurant, on a page with allergens
  | "call_restaurant"
  | "visit_restaurant_site"
  | "view_allergen_source"
  | "report_problem"
  | "open_restaurant_from_list"
  | "open_restaurant_from_map";

/** Like page views, nothing leaves before consent: gtag only exists once it was given. */
export function trackEvent(name: AnalyticsEvent): void {
  if (!isGoogleAnalyticsRuntimeAvailable()) return;
  analyticsWindow().gtag?.("event", name);
}

export function revokeGoogleAnalytics(): void {
  if (typeof window === "undefined") return;

  const id = measurementId();
  const target = analyticsWindow();
  if (isValidMeasurementId(id)) target["ga-disable-" + id] = true;
  target.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  deleteAnalyticsCookies();
}
