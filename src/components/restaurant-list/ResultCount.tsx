import { useMessages } from "../../i18n/useLocale";

export function ResultCount({ count }: { count: number }) {
  const t = useMessages();
  return (
    <p aria-live="polite" className="text-sm text-neutral-600">
      {t.list.resultCount(count)}
    </p>
  );
}
