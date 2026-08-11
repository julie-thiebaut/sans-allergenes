import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AnalyticsConsentContext,
  type AnalyticsConsentContextValue,
} from "./analyticsConsentContext";
import {
  initializeGoogleAnalytics,
  isGoogleAnalyticsRuntimeAvailable,
  readAnalyticsConsent,
  revokeGoogleAnalytics,
  storeAnalyticsConsent,
  trackPageView,
  type AnalyticsConsent,
} from "./googleAnalytics";

export function AnalyticsConsentBanner({
  open,
  hasExistingChoice,
  onAccept,
  onRefuse,
  onClose,
}: {
  open: boolean;
  hasExistingChoice: boolean;
  onAccept: () => void;
  onRefuse: () => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const buttonClass =
    "min-h-11 flex-1 rounded-md border border-neutral-900 px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 sm:flex-none";

  return (
    <aside
      aria-label="Choix relatifs à la mesure d’audience"
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-xl border border-neutral-300 bg-white p-5 text-neutral-700 shadow-2xl sm:bottom-5 sm:p-6"
      role="dialog"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Mesure d’audience facultative</h2>
          <p className="mt-2 text-sm leading-relaxed">
            Avec votre accord, Google Analytics nous aide à compter les visites et les pages
            consultées. Les filtres d’allergènes et les recherches d’adresse ne sont pas envoyés à
            Analytics. Refuser ne change rien au fonctionnement du site.{" "}
            <Link
              className="font-medium text-brand-700 underline underline-offset-2"
              to="/confidentialite#cookies"
            >
              En savoir plus
            </Link>
            .
          </p>
        </div>
        {hasExistingChoice && (
          <button
            aria-label="Fermer les réglages de cookies"
            className="-mr-2 -mt-2 rounded-md p-2 text-xl leading-none text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button className={buttonClass} onClick={onRefuse} type="button">
          Refuser
        </button>
        <button
          className={[buttonClass, "bg-brand-500 hover:bg-brand-400"].join(" ")}
          onClick={onAccept}
          type="button"
        >
          Accepter
        </button>
      </div>
    </aside>
  );
}

export function AnalyticsConsentProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  // Snapshot the prerender/runtime decision before child effects can normalise the URL.
  const [isAvailable] = useState(() => isGoogleAnalyticsRuntimeAvailable());
  const [choice, setChoice] = useState<AnalyticsConsent | null>(() => readAnalyticsConsent());
  const [isPanelOpen, setPanelOpen] = useState(() => isAvailable && choice === null);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!isAvailable || choice !== "accepted") return;

    let cancelled = false;
    void initializeGoogleAnalytics().then((initialized) => {
      if (cancelled || !initialized || lastTrackedPath.current === location.pathname) return;
      trackPageView();
      lastTrackedPath.current = location.pathname;
    });

    return () => {
      cancelled = true;
    };
  }, [choice, isAvailable, location.pathname]);

  const accept = useCallback(() => {
    storeAnalyticsConsent("accepted");
    setChoice("accepted");
    setPanelOpen(false);
  }, []);

  const refuse = useCallback(() => {
    storeAnalyticsConsent("refused");
    revokeGoogleAnalytics();
    lastTrackedPath.current = null;
    setChoice("refused");
    setPanelOpen(false);
  }, []);

  const value = useMemo<AnalyticsConsentContextValue>(
    () => ({
      isAvailable,
      choice,
      openSettings: () => setPanelOpen(true),
    }),
    [choice, isAvailable],
  );

  return (
    <AnalyticsConsentContext.Provider value={value}>
      {children}
      <AnalyticsConsentBanner
        open={isPanelOpen}
        hasExistingChoice={choice !== null}
        onAccept={accept}
        onRefuse={refuse}
        onClose={() => setPanelOpen(false)}
      />
    </AnalyticsConsentContext.Provider>
  );
}
