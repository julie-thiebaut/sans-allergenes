import type { Locale } from "../i18n/locale";

/** BCP 47 tags for each language. British English, like the rest of the English interface. */
const INTL_LOCALE: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

// Built once per language: creating an Intl.DateTimeFormat takes about a millisecond on a slow
// phone, and the list writes a date on each of its hundreds of cards.
const VERIFIED_DATE: Record<Locale, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat(INTL_LOCALE.fr, { day: "numeric", month: "long", year: "numeric" }),
  en: new Intl.DateTimeFormat(INTL_LOCALE.en, { day: "numeric", month: "long", year: "numeric" }),
};

export function formatVerifiedDate(isoDate: string, locale: Locale = "fr"): string {
  try {
    return VERIFIED_DATE[locale].format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

// « septembre 2026 ». En UTC, le fuseau des dates enregistrées : ailleurs, le 1er du mois à minuit
// s'afficherait sur un fuseau en retard comme le mois précédent.
const MONTH_YEAR: Record<Locale, Intl.DateTimeFormat> = {
  fr: new Intl.DateTimeFormat(INTL_LOCALE.fr, { month: "long", year: "numeric", timeZone: "UTC" }),
  en: new Intl.DateTimeFormat(INTL_LOCALE.en, { month: "long", year: "numeric", timeZone: "UTC" }),
};

export function formatMonthYear(isoDate: string, locale: Locale = "fr"): string {
  try {
    return MONTH_YEAR[locale].format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}
