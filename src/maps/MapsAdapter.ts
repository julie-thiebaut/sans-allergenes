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

export interface AddressSuggestion {
  placeId: string;
  description: string;
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
  /** Live address predictions as the user types, biased to Paris. Empty input -> []. */
  getAddressSuggestions(input: string): Promise<AddressSuggestion[]>;
  /** Resolves a previously-suggested place (by id) to a coordinate. */
  resolvePlace(placeId: string): Promise<LatLngLiteral | null>;
}

export type MapsRuntimeState =
  | { status: "loading" }
  | { status: "disabled" }
  | { status: "failed"; reason: string }
  | { status: "ready"; adapter: MapsAdapter };

export const PARIS_CENTER: LatLngLiteral = { lat: 48.8566, lng: 2.3522 };
export const PARIS_DEFAULT_ZOOM = 12;
// Neighborhood-scale rather than street-level (16+), so restaurants a few blocks from the
// searched address stay visible in the bounds-clipped list instead of all dropping out.
export const ADDRESS_SEARCH_ZOOM = 15;
/** Biases (not restricts) address suggestions towards the Paris area. */
export const PARIS_BOUNDS_BIAS: MapBoundsLiteral = {
  north: 48.902,
  south: 48.815,
  east: 2.469,
  west: 2.224,
};

export function isPointWithinBounds(point: LatLngLiteral, bounds: MapBoundsLiteral): boolean {
  const withinLat = point.lat <= bounds.north && point.lat >= bounds.south;
  // Handle bounds crossing the antimeridian (east < west), not expected for Paris but cheap to be correct.
  const withinLng =
    bounds.west <= bounds.east
      ? point.lng >= bounds.west && point.lng <= bounds.east
      : point.lng >= bounds.west || point.lng <= bounds.east;
  return withinLat && withinLng;
}
