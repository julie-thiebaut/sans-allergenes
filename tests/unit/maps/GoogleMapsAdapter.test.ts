import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GoogleMapsAdapter } from "../../../src/maps/GoogleMapsAdapter";

vi.mock("@googlemaps/markerclusterer", () => ({ MarkerClusterer: class {} }));

const setIcon = vi.fn();

class FakeMarker {
  addListener = vi.fn();
  setMap = vi.fn();
  setIcon = setIcon;
}

beforeEach(() => {
  setIcon.mockClear();
  vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "test-key");
  vi.stubGlobal("google", { maps: { Map: class {}, Marker: FakeMarker, Point: class {} } });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("GoogleMapsAdapter", () => {
  it("only gives a new icon to a marker whose highlight changes", async () => {
    const adapter = new GoogleMapsAdapter();
    await adapter.mount(document.createElement("div"), {
      center: { lat: 48.86, lng: 2.35 },
      zoom: 12,
    });
    const point = { id: "a", position: { lat: 48.86, lng: 2.35 }, label: "A" };
    const handle = adapter.setMarkers([point], vi.fn())[0];
    if (!handle) throw new Error("no marker handle");

    handle.setHighlighted(false);
    expect(setIcon).not.toHaveBeenCalled();

    handle.setHighlighted(true);
    handle.setHighlighted(true);
    expect(setIcon).toHaveBeenCalledTimes(1);

    handle.setHighlighted(false);
    expect(setIcon).toHaveBeenCalledTimes(2);
  });
});
