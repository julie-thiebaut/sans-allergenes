import { ALLERGEN_IDS, type AllergenId, type AllergenStatus } from "./schemas";

/** French display labels — separate from schemas.ts so wording changes never touch validation. */
export const ALLERGEN_LABELS_FR: Record<AllergenId, string> = {
  gluten: "Gluten",
  crustaces: "Crustacés",
  oeufs: "Œufs",
  poisson: "Poisson",
  arachides: "Arachides",
  soja: "Soja",
  lait: "Lait",
  fruits_a_coque: "Fruits à coque",
  celeri: "Céleri",
  moutarde: "Moutarde",
  sesame: "Sésame",
  sulfites: "Sulfites",
  lupin: "Lupin",
  mollusques: "Mollusques",
};

export const ALLERGENS_SORTED_FR: AllergenId[] = [...ALLERGEN_IDS].sort((a, b) =>
  ALLERGEN_LABELS_FR[a].localeCompare(ALLERGEN_LABELS_FR[b], "fr"),
);

/**
 * Decorative pictograms, always paired with the text label (ALLERGEN_LABELS_FR) — never
 * the sole way to identify an allergen, since emoji rendering/recognition isn't guaranteed.
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
export const ALLERGEN_STATUS_LABELS_FR: Record<AllergenStatus, string> = {
  present: "Présent",
  may_contain: "Traces possibles",
  not_declared: "Non renseigné",
  unknown: "Inconnu",
};

export const ALLERGEN_STATUS_DESCRIPTIONS_FR: Record<AllergenStatus, string> = {
  present: "Cet allergène est déclaré présent dans ce plat.",
  may_contain: "Des traces de cet allergène sont possibles (contamination croisée).",
  not_declared: "Le restaurant n'a pas renseigné d'information pour cet allergène.",
  unknown: "Aucune information disponible pour cet allergène.",
};
