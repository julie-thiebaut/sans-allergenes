import { useEffect } from "react";
import { useDataContext } from "../data/DataProvider";
import { useContentTranslationsStatus } from "../i18n/ContentTranslations";

/**
 * Flags the DOM once the app has finished its initial data load (success or error), and, on an
 * English page, its translations, so scripts/prerender.ts knows it's safe to capture
 * page.content() instead of racing React.
 */
export function PrerenderReadyMarker() {
  const data = useDataContext();
  const translations = useContentTranslationsStatus();
  const ready = data.status !== "loading" && translations !== "loading";

  useEffect(() => {
    if (ready) document.body.dataset.ssrReady = "true";
    else delete document.body.dataset.ssrReady;
  }, [ready]);

  return null;
}
