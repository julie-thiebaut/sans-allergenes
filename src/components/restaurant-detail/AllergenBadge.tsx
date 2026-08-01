import {
  ALLERGEN_LABELS_FR,
  ALLERGEN_STATUS_DESCRIPTIONS_FR,
  ALLERGEN_STATUS_LABELS_FR,
} from "../../data/allergenLabels";
import type { AllergenId, AllergenStatus } from "../../data/types";

// Each status is distinguished by an icon glyph AND a border/background style AND its text
// label — never by color alone, so the difference reads in grayscale or for color-blind users.
const STATUS_STYLES: Record<AllergenStatus, { className: string; icon: string }> = {
  present: { className: "border-red-400 bg-red-50 text-red-800", icon: "●" },
  may_contain: { className: "border-amber-400 bg-amber-50 text-amber-800", icon: "▲" },
  not_declared: { className: "border-neutral-300 bg-neutral-50 text-neutral-600", icon: "–" },
  unknown: {
    className: "border-neutral-300 border-dashed bg-neutral-50 text-neutral-500",
    icon: "?",
  },
};

export function AllergenBadge({
  allergenId,
  status,
}: {
  allergenId: AllergenId;
  status: AllergenStatus;
}) {
  const style = STATUS_STYLES[status];
  const label = `${ALLERGEN_LABELS_FR[allergenId]} : ${ALLERGEN_STATUS_LABELS_FR[status]}`;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${style.className}`}
      title={ALLERGEN_STATUS_DESCRIPTIONS_FR[status]}
    >
      <span aria-hidden="true" className="font-bold">
        {style.icon}
      </span>
      <span>{label}</span>
    </span>
  );
}
