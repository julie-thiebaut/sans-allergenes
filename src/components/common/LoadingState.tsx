import { useMessages } from "../../i18n/useLocale";

export function LoadingState({ label }: { label?: string }) {
  const t = useMessages();
  return (
    <div role="status" className="flex items-center justify-center gap-2 p-8 text-neutral-600">
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-brand-400 border-t-transparent"
        aria-hidden="true"
      />
      <span>{label ?? t.common.loading}</span>
    </div>
  );
}
