import { createContext, useContext, useState, type ReactNode } from "react";
import type { MobileViewMode } from "../components/layout/MobileViewToggle";
import type { MapBoundsLiteral, MapCamera } from "../maps/MapsAdapter";

/**
 * How the /carte page was left. The page and its providers unmount as soon as a restaurant is
 * opened, so without this "Retour" lands on a brand new page: map view, Paris-wide zoom, list
 * scrolled back to the top. Each piece is written by the component that owns it and read once
 * when that component mounts again.
 *
 * A plain mutable object rather than React state: it is only ever read on mount, so a pan or a
 * scroll writing to it must not re-render anything.
 */
export interface MapPageMemory {
  mobileView: MobileViewMode;
  camera: MapCamera | null;
  bounds: MapBoundsLiteral | null;
  selectedId: string | null;
  /** The scroll offset only means something for the list it was taken on, hence the bounds. */
  listScroll: { top: number; bounds: MapBoundsLiteral | null };
}

function createEmptyMemory(): MapPageMemory {
  return {
    mobileView: "map",
    camera: null,
    bounds: null,
    selectedId: null,
    listScroll: { top: 0, bounds: null },
  };
}

const MapPageMemoryContext = createContext<MapPageMemory | null>(null);

export function MapPageMemoryProvider({ children }: { children: ReactNode }) {
  const [memory] = useState(createEmptyMemory);
  return <MapPageMemoryContext.Provider value={memory}>{children}</MapPageMemoryContext.Provider>;
}

/**
 * Null outside the provider (component tests, a standalone MapView): with nothing to remember
 * to or from, the page simply starts fresh, as it always did.
 */
export function useMapPageMemory(): MapPageMemory | null {
  return useContext(MapPageMemoryContext);
}

export function sameBounds(a: MapBoundsLiteral | null, b: MapBoundsLiteral | null): boolean {
  if (!a || !b) return a === b;
  return a.north === b.north && a.south === b.south && a.east === b.east && a.west === b.west;
}

/**
 * Router state put on the links that open a restaurant from /carte. Its presence tells the
 * restaurant page that the previous history entry IS the map page, so "Retour" can step back
 * to it instead of pushing a fresh /carte on top.
 */
export const OPENED_FROM_MAP_PAGE = { openedFromMapPage: true } as const;

export function wasOpenedFromMapPage(locationState: unknown): boolean {
  return (
    typeof locationState === "object" &&
    locationState !== null &&
    (locationState as { openedFromMapPage?: unknown }).openedFromMapPage === true
  );
}
