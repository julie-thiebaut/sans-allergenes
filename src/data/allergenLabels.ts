import type { Locale } from "../i18n/locale";
import { en } from "../i18n/messages/en";
import { fr } from "../i18n/messages/fr";
import { ALLERGEN_IDS, type AllergenId, type AllergenStatus } from "./schemas";

/** Display labels live with the other interface strings (src/i18n/messages), per language. */
export const ALLERGEN_LABELS: Record<Locale, Record<AllergenId, string>> = {
  fr: fr.allergens,
  en: en.allergens,
};

export const ALLERGEN_LABELS_FR: Record<AllergenId, string> = fr.allergens;

/** In each language's alphabetical order, so a visitor finds an allergen where they expect it. */
export const ALLERGENS_SORTED: Record<Locale, AllergenId[]> = {
  fr: [...ALLERGEN_IDS].sort((a, b) => fr.allergens[a].localeCompare(fr.allergens[b], "fr")),
  en: [...ALLERGEN_IDS].sort((a, b) => en.allergens[a].localeCompare(en.allergens[b], "en")),
};

export const ALLERGENS_SORTED_FR: AllergenId[] = ALLERGENS_SORTED.fr;

/**
 * Decorative pictograms, always paired with the text label — never the sole way to identify an
 * allergen, since emoji rendering/recognition isn't guaranteed.
 */
export const ALLERGEN_ICONS: Record<AllergenId, string> = {
  gluten: "🌾",
  crustaces: "🦐",
  oeufs: "🥚",
  poisson: "🐟",
  arachides: "🥜",
  soja: "🫘",
  lait: "🥛",
  fruits_a_coque: "🌰",
  celeri: "🥬",
  moutarde: "🫙",
  sesame: "🟤",
  sulfites: "🍷",
  lupin: "🌸",
  mollusques: "🐚",
};

/**
 * Text label per status. Deliberately none of these say "safe"/"sûr"/"sans risque" —
 * they describe the level of information available, not a safety guarantee.
 */
export const ALLERGEN_STATUS_LABELS_FR: Record<AllergenStatus, string> = fr.allergenStatus;

export const ALLERGEN_STATUS_DESCRIPTIONS_FR: Record<AllergenStatus, string> =
  fr.allergenStatusDescriptions;
