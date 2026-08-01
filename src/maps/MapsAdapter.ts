export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface MapBoundsLiteral {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarkerHandle {
  id: string;
  setHighlighted(highlighted: boolean): void;
  remove(): void;
}

export interface MapMarkerPoint {
  id: string;
  position: LatLngLiteral;
  /** Accessible label used for the marker's title/aria attributes — never rely on color alone. */
  label: string;
}

/**
 * Abstraction over the map SDK so components never touch `window.google.maps` directly.
 * This is what makes it possible to (a) mock the map entirely in tests with zero network
 * calls, and (b) share one implementation-agnostic contract between the real Google Maps
 * adapter and the disabled/failed fallback path.
 */
export interface MapsAdapter {
  mount(container: HTMLElement, options: { center: LatLngLiteral; zoom: number }): Promise<void>;
  unmount(): void;
  setMarkers(points: MapMarkerPoint[], onMarkerClick: (id: string) => void): MapMarkerHandle[];
  setCenter(position: LatLngLiteral, zoom?: number): void;
  /** Returns an unsubscribe function. */
  onBoundsChanged(callback: (bounds: MapBoundsLiteral) => void): () => void;
  getBounds(): MapBoundsLiteral | null;
}

export type MapsRuntimeState =
  | { status: "loading" }
  | { status: "disabled" }
  | { status: "failed"; reason: string }
  | { status: "ready"; adapter: MapsAdapter };

export const PARIS_CENTER: LatLngLiteral = { lat: 48.8566, lng: 2.3522 };
export const PARIS_DEFAULT_ZOOM = 12;

export function isPointWithinBounds(point: LatLngLiteral, bounds: MapBoundsLiteral): boolean {
  const withinLat = point.lat <= bounds.north && point.lat >= bounds.south;
  // Handle bounds crossing the antimeridian (east < west), not expected for Paris but cheap to be correct.
  const withinLng =
    bounds.west <= bounds.east
      ? point.lng >= bounds.west && point.lng <= bounds.east
      : point.lng >= bounds.west || point.lng <= bounds.east;
  return withinLat && withinLng;
}
