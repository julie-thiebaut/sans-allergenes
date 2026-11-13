import { useMessages } from "../../i18n/useLocale";

export function AllergenSafetyDisclaimer() {
  const t = useMessages();
  return (
    <div
      role="note"
      className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
    >
      <p>{t.restaurant.disclaimer}</p>
    </div>
  );
}
