import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ConfigSchema } from "../data/schemas";
import type { MapsAdapter } from "./MapsAdapter";
import { MapsContext, type MapsConfigState } from "./useMapsContext";

/**
 * Resolves whether Google Maps should be shown by fetching config.json (no-store, so a
 * redeploy that flips googleMapsEnabled is picked up on next load without a cached false
 * negative/positive). The real Maps adapter module is only ever dynamically imported from
 * inside createAdapter(), which MapView calls solely when configState is "enabled" — so the
 * Maps script-loading code path, and the resulting network request, never runs when disabled.
 */
export function MapsProvider({ children }: { children: ReactNode }) {
  const [configState, setConfigState] = useState<MapsConfigState>("loading");

  useEffect(() => {
    // The build-time prerender script (scripts/prerender.ts) navigates here with this flag
    // so it NEVER fetches config.json or touches the real Google Maps script, regardless of
    // the committed googleMapsEnabled value — prerendering must never trigger a billable call.
    if (new URLSearchParams(window.location.search).has("__prerender")) {
      setConfigState("disabled");
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}config.json`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`config.json HTTP ${response.status}`);
        }
        const json: unknown = await response.json();
        const config = ConfigSchema.parse(json);
        if (!cancelled) {
          setConfigState(config.googleMapsEnabled ? "enabled" : "disabled");
        }
      } catch (error) {
        console.error("Impossible de lire config.json : la carte reste désactivée.", error);
        if (!cancelled) {
          setConfigState("disabled");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const createAdapter = useMemo(
    () => async (): Promise<MapsAdapter> => {
      const { GoogleMapsAdapter } = await import("./GoogleMapsAdapter");
      return new GoogleMapsAdapter();
    },
    [],
  );

  const value = useMemo(() => ({ configState, createAdapter }), [configState, createAdapter]);

  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
}
