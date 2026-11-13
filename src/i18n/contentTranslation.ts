import { z } from "zod";
import type { Locale } from "./locale";

/**
 * Restaurant texts written in French in the records — descriptions and coverage notices — with
 * their English translation, in public/data/translations/en.json. The file is keyed by the FRENCH
 * TEXT itself, not by restaurant: a chain's restaurants share one notice and one translation, and
 * a record whose French text changes no longer finds its old translation. It then shows the
 * current French text, marked as French, rather than an English text that says something else.
 * A notice says what a restaurant's allergen declaration does not cover: a stale translation of it
 * would be worse than none.
 *
 * Kept free of React, for scripts/prerender.ts and scripts/validate-data.ts.
 */
export const ContentTranslationFileSchema = z.record(z.string().min(1), z.string().min(1));
export type ContentTranslationFile = z.infer<typeof ContentTranslationFileSchema>;

export interface LocalizedText {
  text: string;
  /** The language the text is actually in, for the element's `lang` attribute. */
  lang: Locale;
}

export function localizeText(
  french: string,
  locale: Locale,
  table: ContentTranslationFile | undefined,
): LocalizedText {
  if (locale === "fr") return { text: french, lang: "fr" };
  const translated = table?.[french];
  return translated ? { text: translated, lang: locale } : { text: french, lang: "fr" };
}

/** The restaurant fields translated through the table. */
export const TRANSLATED_RESTAURANT_FIELDS = ["description", "allergenCoverageNotice"] as const;
