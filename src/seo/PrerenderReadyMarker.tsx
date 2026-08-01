import { useEffect } from "react";
import { useDataContext } from "../data/DataProvider";

/**
 * Flags the DOM once the app has finished its initial data load (success or error), so
 * scripts/prerender.ts knows it's safe to capture page.content() instead of racing React.
 */
export function PrerenderReadyMarker() {
  const data = useDataContext();

  useEffect(() => {
    if (data.status !== "loading") {
      document.body.dataset.ssrReady = "true";
    }
  }, [data.status]);

  return null;
}
