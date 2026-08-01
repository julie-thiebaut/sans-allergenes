import type { PriceLevel } from "../../data/types";

const MAX_LEVEL = 4;

export function PriceLevelIndicator({ level }: { level?: PriceLevel }) {
  if (!level) return null;
  const label = `Niveau de prix : ${level} sur ${MAX_LEVEL}`;

  return (
    <span className="text-sm text-neutral-600" aria-label={label} title={label}>
      <span aria-hidden="true">{"€".repeat(level)}</span>
      <span aria-hidden="true" className="text-neutral-300">
        {"€".repeat(MAX_LEVEL - level)}
      </span>
    </span>
  );
}
