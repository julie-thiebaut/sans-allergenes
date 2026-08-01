import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { MapBoundsLiteral } from "../maps/MapsAdapter";

interface MapBoundsContextValue {
  /** null = unconstrained (initial Paris view, or Maps disabled/failed) — list shows all matches. */
  bounds: MapBoundsLiteral | null;
  setBounds: (bounds: MapBoundsLiteral | null) => void;
}

const MapBoundsContext = createContext<MapBoundsContextValue | null>(null);

export function MapBoundsProvider({ children }: { children: ReactNode }) {
  const [bounds, setBounds] = useState<MapBoundsLiteral | null>(null);
  const value = useMemo(() => ({ bounds, setBounds }), [bounds]);
  return <MapBoundsContext.Provider value={value}>{children}</MapBoundsContext.Provider>;
}

export function useMapBoundsContext(): MapBoundsContextValue {
  const context = useContext(MapBoundsContext);
  if (!context) {
    throw new Error("useMapBoundsContext must be used within a MapBoundsProvider");
  }
  return context;
}
