import type {
  AddressSuggestion,
  LatLngLiteral,
  MapBoundsLiteral,
  MapMarkerHandle,
  MapMarkerPoint,
  MapsAdapter,
} from "./MapsAdapter";
import { PARIS_BOUNDS_BIAS } from "./MapsAdapter";

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
      // Deliberately no loading=async here: that flag switches the script into Google's
      // lazy library-loading mode (which requires google.maps.importLibrary and can race
      // with a plain onload handler). This is a classic synchronous include — once onload
      // fires, google.maps.Map/Marker/etc. are already available as real globals.
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=places`;
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

// Fully desaturated map so the mustard-yellow markers are the only spot of color —
// also means there's no separate "Satellite" imagery to toggle to, so the map type
// control (Carte/Satellite switcher) is hidden below rather than left pointing at an
// option that no longer makes visual sense.
const GRAYSCALE_MAP_STYLE: google.maps.MapTypeStyle[] = [{ stylers: [{ saturation: -100 }] }];

function markerIcon(highlighted: boolean): google.maps.Symbol {
  // Highlighted state is distinguished by SIZE + outline weight, not color alone,
  // so it stays legible for color-blind users and in high-contrast mode.
  return {
    path: "M12 0C7 0 3 4 3 9c0 6.5 9 15 9 15s9-8.5 9-15c0-5-4-9-9-9z",
    fillColor: "#f1b204",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: highlighted ? 3 : 1.5,
    scale: highlighted ? 1.9 : 1.2,
    anchor: new google.maps.Point(12, 24),
  };
}

function parisLatLngBounds(): google.maps.LatLngBounds {
  return new google.maps.LatLngBounds(
    { lat: PARIS_BOUNDS_BIAS.south, lng: PARIS_BOUNDS_BIAS.west },
    { lat: PARIS_BOUNDS_BIAS.north, lng: PARIS_BOUNDS_BIAS.east },
  );
}

export class GoogleMapsAdapter implements MapsAdapter {
  private map: google.maps.Map | null = null;
  private markers: Map<string, google.maps.Marker> = new Map();
  private clusterer: import("@googlemaps/markerclusterer").MarkerClusterer | null = null;
  // Groups a user's typing + selection into one billable Autocomplete session, per Google's
  // pricing model — reset once a session concludes (selection made, or input cleared).
  private autocompleteSessionToken: google.maps.places.AutocompleteSessionToken | null = null;
  private lastPredictions = new Map<string, google.maps.places.PlacePrediction>();

  async mount(
    container: HTMLElement,
    options: { center: LatLngLiteral; zoom: number },
  ): Promise<void> {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GOOGLE_MAPS_API_KEY est manquante — voir .env.example");
    }

    await loadGoogleMapsScript(apiKey);
    // The script is injected directly (see loadGoogleMapsScript below) rather than via
    // Google's official inline bootstrap loader snippet, so google.maps.importLibrary is
    // never defined here — google.maps.Map/Marker are plain globals once the script's
    // onload fires, which loadGoogleMapsScript's promise already waits for.
    this.map = new google.maps.Map(container, {
      center: options.center,
      zoom: options.zoom,
      clickableIcons: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      styles: GRAYSCALE_MAP_STYLE,
    });
  }

  unmount(): void {
    this.clearMarkers();
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
    // Scoped to this call (not a shared instance field) — MapView re-registers this listener
    // every time `restaurants` changes, and a shared field would let a later registration's
    // cleanup accidentally remove an earlier (still-active) listener, or vice versa.
    const listener = this.map.addListener("bounds_changed", () => {
      const bounds = this.getBounds();
      if (bounds) callback(bounds);
    });
    return () => listener.remove();
  }

  getBounds(): MapBoundsLiteral | null {
    const bounds = this.map?.getBounds();
    if (!bounds) return null;
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return { north: ne.lat(), east: ne.lng(), south: sw.lat(), west: sw.lng() };
  }

  async getAddressSuggestions(input: string): Promise<AddressSuggestion[]> {
    if (!input.trim()) {
      this.autocompleteSessionToken = null;
      this.lastPredictions.clear();
      return [];
    }
    if (!this.autocompleteSessionToken) {
      this.autocompleteSessionToken = new google.maps.places.AutocompleteSessionToken();
    }
    try {
      const { suggestions } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        locationBias: parisLatLngBounds(),
        includedRegionCodes: ["fr"],
        sessionToken: this.autocompleteSessionToken,
      });
      this.lastPredictions.clear();
      const results: AddressSuggestion[] = [];
      for (const suggestion of suggestions) {
        const prediction = suggestion.placePrediction;
        if (!prediction) continue;
        this.lastPredictions.set(prediction.placeId, prediction);
        results.push({ placeId: prediction.placeId, description: prediction.text.text });
      }
      return results;
    } catch {
      return [];
    }
  }

  async resolvePlace(placeId: string): Promise<LatLngLiteral | null> {
    const prediction = this.lastPredictions.get(placeId);
    // The session concludes once a selection is resolved — a fresh token is needed next time.
    this.autocompleteSessionToken = null;
    this.lastPredictions.clear();
    try {
      const place = prediction ? prediction.toPlace() : new google.maps.places.Place({ id: placeId });
      await place.fetchFields({ fields: ["location"] });
      return place.location ? { lat: place.location.lat(), lng: place.location.lng() } : null;
    } catch {
      return null;
    }
  }
}
