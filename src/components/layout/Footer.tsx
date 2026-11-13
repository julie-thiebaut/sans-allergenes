import { Link } from "react-router-dom";
import { useAnalyticsConsent } from "../../analytics/useAnalyticsConsent";
import { pagePath } from "../../i18n/locale";
import { useLocale, useMessages } from "../../i18n/useLocale";

export function Footer() {
  const year = new Date().getFullYear();
  const analyticsConsent = useAnalyticsConsent();
  const locale = useLocale();
  const t = useMessages();

  return (
    <footer className="border-t border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-500 sm:text-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-between">
        <span>© {year} Julie Thiebaut</span>
        <nav
          aria-label={t.footer.navLabel}
          className="flex flex-wrap justify-center gap-x-4 gap-y-1"
        >
          <Link
            className="hover:text-neutral-900 hover:underline"
            to={pagePath("allergensOnlineNote", locale)}
          >
            {t.footer.notes}
          </Link>
          <Link className="hover:text-neutral-900 hover:underline" to={pagePath("legal", locale)}>
            {t.footer.legal}
          </Link>
          <Link className="hover:text-neutral-900 hover:underline" to={pagePath("privacy", locale)}>
            {t.footer.privacy}
          </Link>
          {analyticsConsent.isAvailable && (
            <button
              className="hover:text-neutral-900 hover:underline"
              onClick={analyticsConsent.openSettings}
              type="button"
            >
              {t.footer.cookies}
            </button>
          )}
          <a
            className="hover:text-neutral-900 hover:underline"
            href="mailto:contact@sans-allergenes.fr"
          >
            {t.footer.contact}
          </a>
        </nav>
      </div>
    </footer>
  );
}
