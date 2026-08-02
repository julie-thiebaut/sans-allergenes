import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AddressSuggestion } from "../maps/MapsAdapter";

export interface MapSearchActions {
  /** Live address predictions as the user types, biased to Paris. */
  getAddressSuggestions: (input: string) => Promise<AddressSuggestion[]>;
  /** Resolves + zooms to a previously-suggested place. */
  selectSuggestion: (placeId: string) => Promise<boolean>;
}

interface MapActionsContextValue {
  /** Null while no map is mounted (e.g. Maps disabled, or the mobile list view is active). */
  actions: MapSearchActions | null;
  registerActions: (actions: MapSearchActions | null) => void;
}

const MapActionsContext = createContext<MapActionsContextValue | null>(null);

/** Lets the search bar (Navbar) trigger autocomplete-and-zoom on whichever MapView is mounted. */
export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<MapSearchActions | null>(null);
  // Stable identity (no deps) — MapView's effect depends on this, and a changing reference
  // there would re-run the effect, which calls this, which changes state, which would change
  // the reference again: an infinite render loop.
  const registerActions = useCallback((next: MapSearchActions | null) => setActions(next), []);
  const value = useMemo(() => ({ actions, registerActions }), [actions, registerActions]);
  return <MapActionsContext.Provider value={value}>{children}</MapActionsContext.Provider>;
}

export function useMapActionsContext(): MapActionsContextValue {
  const context = useContext(MapActionsContext);
  if (!context) {
    throw new Error("useMapActionsContext must be used within a MapActionsProvider");
  }
  return context;
}
