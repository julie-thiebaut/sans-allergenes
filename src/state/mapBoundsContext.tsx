import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MapBoundsLiteral } from "../maps/MapsAdapter";
import { useMapPageMemory } from "./MapPageMemoryContext";

interface MapBoundsContextValue {
  /** null = unconstrained (initial Paris view, or Maps disabled/failed) — list shows all matches. */
  bounds: MapBoundsLiteral | null;
  setBounds: (bounds: MapBoundsLiteral | null) => void;
}

const MapBoundsContext = createContext<MapBoundsContextValue | null>(null);

export function MapBoundsProvider({ children }: { children: ReactNode }) {
  const memory = useMapPageMemory();
  // Restored rather than reset: on mobile the list view has no map mounted to report bounds
  // again, so coming back from a restaurant would otherwise widen the list to all of Paris.
  const [bounds, setBounds] = useState<MapBoundsLiteral | null>(memory?.bounds ?? null);

  useEffect(() => {
    if (memory) memory.bounds = bounds;
  }, [memory, bounds]);

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
