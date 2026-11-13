import { ALLERGEN_ICONS } from "../../data/allergenLabels";
import type { AllergenId } from "../../data/types";
import { useMessages } from "../../i18n/useLocale";

/**
 * A single allergen chip, deliberately status-agnostic: the status is carried by the labelled
 * group this chip sits in ("Présent", "Traces possibles"), never by the chip's own colour.
 * That keeps the menu free of alarm colours while leaving the meaning spelled out in words.
 */
export function AllergenBadge({ allergenId }: { allergenId: AllergenId }) {
  const t = useMessages();
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-800">
      <span aria-hidden="true">{ALLERGEN_ICONS[allergenId]}</span>
      <span>{t.allergens[allergenId]}</span>
    </span>
  );
}
