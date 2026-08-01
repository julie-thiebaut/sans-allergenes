import { useEffect, useRef, useState } from "react";
import type { RestaurantWithMenu } from "../../data/types";
import {
  PARIS_CENTER,
  PARIS_DEFAULT_ZOOM,
  type MapMarkerHandle,
  type MapsAdapter,
} from "../../maps/MapsAdapter";
import { useMapsContext } from "../../maps/useMapsContext";
import { useMapBoundsContext } from "../../state/mapBoundsContext";
import { useSelectionContext } from "../../state/SelectionContext";
import { LoadingState } from "../common/LoadingState";
import { BackToParisButton } from "../layout/BackToParisButton";
import { MapFallback } from "./MapFallback";
import { MapSelectionPreviewCard } from "./MapSelectionPreviewCard";

export function MapView({ restaurants }: { restaurants: RestaurantWithMenu[] }) {
  const { configState, createAdapter } = useMapsContext();
  const { setBounds } = useMapBoundsContext();
  const { hoveredId, selectedId, setSelectedId } = useSelectionContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<MapsAdapter | null>(null);
  const markerHandlesRef = useRef<Map<string, MapMarkerHandle>>(new Map());
  const [mapStatus, setMapStatus] = useState<"pending" | "ready" | "failed">("pending");

  // Mount the adapter only once Maps is confirmed enabled — this is the sole call site for
  // createAdapter(), so the real Google Maps script never loads on the disabled path.
  useEffect(() => {
    if (configState !== "enabled") return;
    let cancelled = false;

    void (async () => {
      try {
        const adapter = await createAdapter();
        if (cancelled || !containerRef.current) return;
        await adapter.mount(containerRef.current, {
          center: PARIS_CENTER,
          zoom: PARIS_DEFAULT_ZOOM,
        });
        if (cancelled) {
          adapter.unmount();
          return;
        }
        adapterRef.current = adapter;
        setMapStatus("ready");
      } catch (error) {
        console.error("Échec du chargement de la carte Google Maps", error);
        if (!cancelled) setMapStatus("failed");
      }
    })();

    return () => {
      cancelled = true;
      adapterRef.current?.unmount();
      adapterRef.current = null;
    };
  }, [configState, createAdapter]);

  // Markers + bounds listener, once the map has actually mounted.
  useEffect(() => {
    const adapter = adapterRef.current;
    if (mapStatus !== "ready" || !adapter) return;

    const unsubscribeBounds = adapter.onBoundsChanged((bounds) => setBounds(bounds));
    const handles = adapter.setMarkers(
      restaurants.map((restaurant) => ({
        id: restaurant.id,
        position: { lat: restaurant.latitude, lng: restaurant.longitude },
        label: restaurant.name,
      })),
      (id) => setSelectedId(id),
    );
    markerHandlesRef.current = new Map(handles.map((handle) => [handle.id, handle]));

    return () => {
      unsubscribeBounds();
      handles.forEach((handle) => handle.remove());
      markerHandlesRef.current = new Map();
    };
  }, [mapStatus, restaurants, setBounds, setSelectedId]);

  // Highlight the hovered/selected marker — size/outline change, not color alone.
  useEffect(() => {
    markerHandlesRef.current.forEach((handle, id) => {
      handle.setHighlighted(id === hoveredId || id === selectedId);
    });
  }, [hoveredId, selectedId]);

  if (configState === "disabled" || mapStatus === "failed") {
    return <MapFallback />;
  }

  const handleBackToParis = () => {
    adapterRef.current?.setCenter(PARIS_CENTER, PARIS_DEFAULT_ZOOM);
    setBounds(null);
  };

  const selectedRestaurant = restaurants.find((restaurant) => restaurant.id === selectedId);

  return (
    <div className="relative h-full">
      {(configState === "loading" || mapStatus === "pending") && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
          <LoadingState label="Chargement de la carte…" />
        </div>
      )}
      <div
        ref={containerRef}
        className="h-full w-full rounded-lg"
        aria-label="Carte des restaurants"
      />
      {mapStatus === "ready" && (
        <div className="absolute right-3 top-3">
          <BackToParisButton onClick={handleBackToParis} />
        </div>
      )}
      {mapStatus === "ready" && selectedRestaurant && (
        <MapSelectionPreviewCard
          restaurant={selectedRestaurant}
          onDismiss={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
