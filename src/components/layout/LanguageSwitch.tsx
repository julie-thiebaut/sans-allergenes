import { Link, useLocation } from "react-router-dom";
import { equivalentPath } from "../../i18n/locale";
import { useLocale, useMessages } from "../../i18n/useLocale";

/**
 * A link to the same page in the other language, named in that language ("English",
 * "Français") so a visitor who does not read the current one still recognises it. It keeps the
 * query string, so the map's filters follow the switch.
 */
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const location = useLocation();
  const locale = useLocale();
  const t = useMessages();
  const target = locale === "fr" ? "en" : "fr";

  return (
    <Link
      to={{ pathname: equivalentPath(location.pathname, target), search: location.search }}
      hrefLang={t.languageSwitch.hreflang}
      lang={t.languageSwitch.hreflang}
      aria-label={t.languageSwitch.ariaLabel}
      className={`shrink-0 rounded-md px-2 py-1 text-sm font-medium text-neutral-700 underline-offset-2 hover:text-neutral-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 ${className}`}
    >
      <span className="sm:hidden" aria-hidden="true">
        {target.toUpperCase()}
      </span>
      <span className="hidden sm:inline">{t.languageSwitch.label}</span>
    </Link>
  );
}
