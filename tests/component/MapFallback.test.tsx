import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SplitView } from "../../src/components/layout/SplitView";
import { MapView } from "../../src/components/map/MapView";
import { MapsProvider } from "../../src/maps/MapsProvider";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { MapBoundsProvider } from "../../src/state/mapBoundsContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import { restaurantWithFullInfo } from "../fixtures/restaurants.fixture";

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function renderMapViewWithRealProvider() {
  return render(
    <MapsProvider>
      <MapBoundsProvider>
        <SelectionProvider>
          <MapView restaurants={[restaurantWithFullInfo]} />
        </SelectionProvider>
      </MapBoundsProvider>
    </MapsProvider>,
  );
}

describe("Maps disabled/failed fallback (no real Google Maps script ever requested)", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
    document.querySelectorAll('script[src*="maps.googleapis.com"]').forEach((el) => el.remove());
  });

  it("shows the neutral fallback and never injects the Google Maps script when googleMapsEnabled is false", async () => {
    global.fetch = vi.fn(async () =>
      jsonResponse({ googleMapsEnabled: false }),
    ) as unknown as typeof fetch;

    renderMapViewWithRealProvider();

    expect(await screen.findByText(/carte temporairement indisponible/i)).toBeInTheDocument();
    expect(document.querySelector('script[src*="maps.googleapis.com"]')).toBeNull();
  });

  it("shows the same neutral fallback (never a raw technical error) when config.json fails to load", async () => {
    global.fetch = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;

    renderMapViewWithRealProvider();

    expect(await screen.findByText(/carte temporairement indisponible/i)).toBeInTheDocument();
    expect(screen.queryByText(/network down/i)).not.toBeInTheDocument();
    expect(document.querySelector('script[src*="maps.googleapis.com"]')).toBeNull();
  });

  it("keeps the restaurant list usable and visible while the map is disabled", async () => {
    global.fetch = vi.fn(async () =>
      jsonResponse({ googleMapsEnabled: false }),
    ) as unknown as typeof fetch;
    // Force the desktop two-column layout so list and map render simultaneously — on mobile,
    // only one panel mounts at a time (covered separately in MobileViewToggle.test.tsx), so
    // this is the right viewport to prove the list survives a disabled map next to it.
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    render(
      <MemoryRouter>
        <MapsProvider>
          <FilterStateProvider>
            <MapBoundsProvider>
              <SelectionProvider>
                <SplitView allRestaurants={[restaurantWithFullInfo]} />
              </SelectionProvider>
            </MapBoundsProvider>
          </FilterStateProvider>
        </MapsProvider>
      </MemoryRouter>,
    );

    await screen.findByText(/carte temporairement indisponible/i);
    expect(screen.getByRole("link", { name: "Le Restaurant Complet" })).toBeInTheDocument();
  });
});
