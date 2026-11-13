import { useMessages } from "../../i18n/useLocale";

export function DemoDataBadge() {
  const t = useMessages();
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      {t.common.demoData}
    </span>
  );
}
