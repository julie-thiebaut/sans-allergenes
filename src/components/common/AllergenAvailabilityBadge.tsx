export function AllergenAvailabilityBadge({ available }: { available: boolean }) {
  if (!available) {
    return <span className="text-xs font-medium text-red-700">Infos allergènes non disponibles</span>;
  }

  return <span className="text-xs text-neutral-500">Infos allergènes disponibles</span>;
}
