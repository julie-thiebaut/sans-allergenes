import type {
  LatLngLiteral,
  MapBoundsLiteral,
  MapMarkerHandle,
  MapMarkerPoint,
  MapsAdapter,
} from "./MapsAdapter";

interface MockMarkerEntry {
  point: MapMarkerPoint;
  highlighted: boolean;
}

/**
 * Synchronous, in-memory stand-in for MapsAdapter — no DOM, no network, no `window.google`.
 * Used unconditionally by Vitest/RTL and exposes `simulate*` helpers so component tests can
 * drive pan/zoom and marker-click behavior without a real map SDK.
 */
export class MockMapsAdapter implements MapsAdapter {
  private markers = new Map<string, MockMarkerEntry>();
  private onMarkerClick: ((id: string) => void) | null = null;
  private boundsListeners: Array<(bounds: MapBoundsLiteral) => void> = [];
  private lastBounds: MapBoundsLiteral | null = null;
  private center: LatLngLiteral | null = null;
  private zoom: number | null = null;

  async mount(
    _container: HTMLElement,
    options: { center: LatLngLiteral; zoom: number },
  ): Promise<void> {
    this.center = options.center;
    this.zoom = options.zoom;
  }

  unmount(): void {
    this.markers.clear();
    this.boundsListeners = [];
    this.onMarkerClick = null;
  }

  setMarkers(points: MapMarkerPoint[], onMarkerClick: (id: string) => void): MapMarkerHandle[] {
    this.markers.clear();
    this.onMarkerClick = onMarkerClick;
    return points.map((point) => {
      this.markers.set(point.id, { point, highlighted: false });
      return {
        id: point.id,
        setHighlighted: (highlighted: boolean) => {
          const entry = this.markers.get(point.id);
          if (entry) entry.highlighted = highlighted;
        },
        remove: () => this.markers.delete(point.id),
      };
    });
  }

  setCenter(position: LatLngLiteral, zoom?: number): void {
    this.center = position;
    if (zoom !== undefined) this.zoom = zoom;
  }

  onBoundsChanged(callback: (bounds: MapBoundsLiteral) => void): () => void {
    this.boundsListeners.push(callback);
    return () => {
      this.boundsListeners = this.boundsListeners.filter((cb) => cb !== callback);
    };
  }

  getBounds(): MapBoundsLiteral | null {
    return this.lastBounds;
  }

  // --- Test-only helpers ---

  simulateBoundsChanged(bounds: MapBoundsLiteral): void {
    this.lastBounds = bounds;
    this.boundsListeners.forEach((cb) => cb(bounds));
  }

  simulateMarkerClick(id: string): void {
    this.onMarkerClick?.(id);
  }

  getMarkerIds(): string[] {
    return [...this.markers.keys()];
  }

  isMarkerHighlighted(id: string): boolean {
    return this.markers.get(id)?.highlighted ?? false;
  }

  getCenter(): LatLngLiteral | null {
    return this.center;
  }

  getZoom(): number | null {
    return this.zoom;
  }
}
