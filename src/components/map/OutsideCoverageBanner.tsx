import { useLocale, useMessages } from "../../i18n/useLocale";
import { requestAreaMailto } from "../../utils/contactLinks";

export function OutsideCoverageBanner() {
  const locale = useLocale();
  const t = useMessages();
  return (
    <p
      role="status"
      className="mx-3 mb-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
    >
      {t.map.outsideCoverageBefore}
      <a className="font-medium underline" href={requestAreaMailto(locale)}>
        contact@sans-allergenes.fr
      </a>
      .
    </p>
  );
}
