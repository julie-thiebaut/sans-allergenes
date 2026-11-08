import { Link } from "react-router-dom";
import { useAnalyticsConsent } from "../../analytics/useAnalyticsConsent";

export function Footer() {
  const year = new Date().getFullYear();
  const analyticsConsent = useAnalyticsConsent();

  return (
    <footer className="border-t border-neutral-200 bg-white px-4 py-2.5 text-xs text-neutral-500 sm:text-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-between">
        <span>© {year} Julie Thiebaut</span>
        <nav
          aria-label="Informations sur le site"
          className="flex flex-wrap justify-center gap-x-4 gap-y-1"
        >
          <Link className="hover:text-neutral-900 hover:underline" to="/notes/allergenes-en-ligne/">
            Notes
          </Link>
          <Link className="hover:text-neutral-900 hover:underline" to="/mentions-legales/">
            Mentions légales
          </Link>
          <Link className="hover:text-neutral-900 hover:underline" to="/confidentialite/">
            Politique de confidentialité
          </Link>
          {analyticsConsent.isAvailable && (
            <button
              className="hover:text-neutral-900 hover:underline"
              onClick={analyticsConsent.openSettings}
              type="button"
            >
              Gérer les cookies
            </button>
          )}
          <a
            className="hover:text-neutral-900 hover:underline"
            href="mailto:contact@sans-allergenes.fr"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
