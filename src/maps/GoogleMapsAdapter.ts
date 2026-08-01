import type {
  LatLngLiteral,
  MapBoundsLiteral,
  MapMarkerHandle,
  MapMarkerPoint,
  MapsAdapter,
} from "./MapsAdapter";

// Module-level singleton so the script (and the maps/marker library imports) are only
// ever requested once, even if mount() is called from multiple places.
let scriptLoadPromise: Promise<typeof google> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<typeof google> {
  if (typeof window !== "undefined" && window.google?.maps) {
    return Promise.resolve(window.google);
  }
  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&v=weekly`;
      script.async = true;
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          reject(new Error("Le script Google Maps s'est chargé sans exposer window.google.maps"));
        }
      };
      script.onerror = () => {
        scriptLoadPromise = null;
        reject(new Error("Échec du chargement du script Google Maps"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptLoadPromise;
}

function markerIcon(highlighted: boolean): google.maps.Symbol {
  // Highlighted state is distinguished by SIZE + outline weight, not color alone,
  // so it stays legible for color-blind users and in high-contrast mode.
  return {
    path: "M12 0C7 0 3 4 3 9c0 6.5 9 15 9 15s9-8.5 9-15c0-5-4-9-9-9z",
    fillColor: highlighted ? "#3c634a" : "#4f7d5e",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: highlighted ? 3 : 1.5,
    scale: highlighted ? 1.9 : 1.2,
    anchor: new google.maps.Point(12, 24),
  };
}

export class GoogleMapsAdapter implements MapsAdapter {
  private map: google.maps.Map | null = null;
  private markers: Map<string, google.maps.Marker> = new Map();
  private clusterer: import("@googlemaps/markerclusterer").MarkerClusterer | null = null;
  private boundsListener: google.maps.MapsEventListener | null = null;

  async mount(
    container: HTMLElement,
    options: { center: LatLngLiteral; zoom: number },
  ): Promise<void> {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GOOGLE_MAPS_API_KEY est manquante — voir .env.example");
    }

    await loadGoogleMapsScript(apiKey);
    const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
    // Requesting the "marker" library keeps google.maps.Marker (and future Advanced Marker
    // migration) explicit under the loading=async bootstrap, even though the legacy
    // Marker class we use below doesn't strictly require a Map ID.
    await google.maps.importLibrary("marker");

    this.map = new Map(container, {
      center: options.center,
      zoom: options.zoom,
      clickableIcons: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
  }

  unmount(): void {
    this.clearMarkers();
    if (this.boundsListener) {
      this.boundsListener.remove();
      this.boundsListener = null;
    }
    this.map = null;
  }

  private clearMarkers(): void {
    this.clusterer?.clearMarkers();
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers.clear();
  }

  setMarkers(points: MapMarkerPoint[], onMarkerClick: (id: string) => void): MapMarkerHandle[] {
    if (!this.map) return [];
    this.clearMarkers();

    const googleMarkers: google.maps.Marker[] = [];
    const handles: MapMarkerHandle[] = points.map((point) => {
      const marker = new google.maps.Marker({
        position: point.position,
        title: point.label,
        icon: markerIcon(false),
      });
      marker.addListener("click", () => onMarkerClick(point.id));
      this.markers.set(point.id, marker);
      googleMarkers.push(marker);

      return {
        id: point.id,
        setHighlighted: (highlighted: boolean) => marker.setIcon(markerIcon(highlighted)),
        remove: () => {
          marker.setMap(null);
          this.markers.delete(point.id);
        },
      };
    });

    void import("@googlemaps/markerclusterer").then(({ MarkerClusterer }) => {
      if (!this.map) return;
      this.clusterer = new MarkerClusterer({ map: this.map, markers: googleMarkers });
    });

    return handles;
  }

  setCenter(position: LatLngLiteral, zoom?: number): void {
    if (!this.map) return;
    this.map.setCenter(position);
    if (zoom !== undefined) {
      this.map.setZoom(zoom);
    }
  }

  onBoundsChanged(callback: (bounds: MapBoundsLiteral) => void): () => void {
    if (!this.map) return () => {};
    this.boundsListener = this.map.addListener("bounds_changed", () => {
      const bounds = this.getBounds();
      if (bounds) callback(bounds);
    });
    return () => this.boundsListener?.remove();
  }

  getBounds(): MapBoundsLiteral | null {
    const bounds = this.map?.getBounds();
    if (!bounds) return null;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return { north: ne.lat(), east: ne.lng(), south: sw.lat(), west: sw.lng() };
  }
}
