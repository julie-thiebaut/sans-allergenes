import { useMessages } from "../../i18n/useLocale";

/** Seule l'absence d'information est signalée : c'est un avertissement. */
export function AllergenAvailabilityBadge() {
  const t = useMessages();
  return (
    <span className="text-xs font-medium text-red-700">{t.common.allergenInfoUnavailable}</span>
  );
}
