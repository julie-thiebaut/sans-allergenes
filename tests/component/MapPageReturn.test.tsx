import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DataContext } from "../../src/data/DataProvider";
import { MockMapsAdapter } from "../../src/maps/MockMapsAdapter";
import { MapsContext } from "../../src/maps/useMapsContext";
import { MapPage } from "../../src/routes/MapPage";
import { RestaurantDetailPage } from "../../src/routes/RestaurantDetailPage";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { MapPageMemoryProvider } from "../../src/state/MapPageMemoryContext";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../fixtures/restaurants.fixture";

/** A POP onto /carte right after the restaurant means "Retour" stepped back in history; a PUSH
 * would mean a new /carte entry stacked on top of the restaurant. */
const seenLocations: Array<{ pathname: string; navigationType: string }> = [];
function LocationSpy() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  seenLocations.push({ pathname, navigationType });
  return null;
}

function renderSite(initialPath: string) {
  const adapters: MockMapsAdapter[] = [];
  const createAdapter = async () => {
    const adapter = new MockMapsAdapter();
    adapters.push(adapter);
    return adapter;
  };

  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <DataContext.Provider
        value={{
          status: "ready",
          restaurants: [restaurantWithFullInfo, restaurantWithoutAllergenInfo],
        }}
      >
        <MapsContext.Provider value={{ configState: "enabled", createAdapter }}>
          <FilterStateProvider>
            <MapPageMemoryProvider>
              <Routes>
                <Route path="/carte" element={<MapPage />} />
                <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
              </Routes>
              <LocationSpy />
            </MapPageMemoryProvider>
          </FilterStateProvider>
        </MapsContext.Provider>
      </DataContext.Provider>
    </MemoryRouter>,
  );

  return { adapters };
}

/** The n-th map mounted in the test (0-based), once its markers are on. */
async function mountedMap(adapters: MockMapsAdapter[], n: number): Promise<MockMapsAdapter> {
  await waitFor(() => expect(adapters[n]?.getMarkerIds()).toHaveLength(2));
  const adapter = adapters[n];
  if (!adapter) throw new Error(`map ${n} never mounted`);
  return adapter;
}

function mockMobileViewport() {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

function listScrollContainer(): HTMLElement {
  const container = screen.getByRole("list", { name: "Liste des restaurants" }).parentElement;
  if (!container) throw new Error("list has no scroll container");
  return container;
}

beforeEach(() => {
  seenLocations.length = 0;
  // jsdom has no scrollIntoView; RestaurantList calls it for the restored selection.
  Element.prototype.scrollIntoView = vi.fn();
  mockMobileViewport();
});

afterEach(() => vi.restoreAllMocks());

describe("Retour from a restaurant to /carte", () => {
  it("comes back to the list view, scrolled where it was, by stepping back in history", async () => {
    const user = userEvent.setup();
    renderSite("/carte");

    await user.click(screen.getByRole("button", { name: "Liste" }));
    const list = listScrollContainer();
    list.scrollTop = 240;
    fireEvent.scroll(list);

    await user.click(screen.getByRole("link", { name: restaurantWithFullInfo.name }));
    expect(
      screen.getByRole("heading", { name: restaurantWithFullInfo.name, level: 1 }),
    ).toBeInTheDocument();

    // The label names where the link actually goes.
    await user.click(screen.getByRole("link", { name: "Retour à la liste" }));

    expect(screen.getByRole("button", { name: "Liste" })).toHaveAttribute("aria-pressed", "true");
    expect(listScrollContainer().scrollTop).toBe(240);
    const restaurantVisit = seenLocations.findIndex(({ pathname }) =>
      pathname.startsWith("/restaurant/"),
    );
    expect(seenLocations[restaurantVisit + 1]).toEqual({
      pathname: "/carte",
      navigationType: "POP",
    });

    // The click that opened it also selected it: the map's preview card is that restaurant.
    await user.click(screen.getByRole("button", { name: "Carte" }));
    expect(await screen.findByRole("link", { name: "Voir la fiche" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: restaurantWithFullInfo.name })).toBeInTheDocument();
  });

  it("comes back to the map at the same place and zoom, with the restaurant still selected", async () => {
    const user = userEvent.setup();
    const { adapters } = renderSite("/carte");
    const firstMap = await mountedMap(adapters, 0);

    const zoomedIn = { center: { lat: 48.86, lng: 2.34 }, zoom: 16 };
    act(() => {
      firstMap.setCenter(zoomedIn.center, zoomedIn.zoom);
      firstMap.simulateBoundsChanged({ north: 48.87, south: 48.85, east: 2.36, west: 2.33 });
      firstMap.simulateMarkerClick(restaurantWithoutAllergenInfo.id);
    });

    await user.click(await screen.findByRole("link", { name: "Voir la fiche" }));
    await user.click(screen.getByRole("link", { name: "Retour à la carte" }));

    const secondMap = await mountedMap(adapters, 1);
    expect(secondMap.getCamera()).toEqual(zoomedIn);
    expect(screen.getByRole("link", { name: "Voir la fiche" })).toBeInTheDocument();
  });

  it("does not carry the list's scroll over to a list the map has since moved away from", async () => {
    const user = userEvent.setup();
    const { adapters } = renderSite("/carte");

    await user.click(screen.getByRole("button", { name: "Liste" }));
    const list = listScrollContainer();
    list.scrollTop = 240;
    fireEvent.scroll(list);

    // Mobile starts on the map, so the map shown again here is the second one mounted.
    await user.click(screen.getByRole("button", { name: "Carte" }));
    const secondMap = await mountedMap(adapters, 1);
    act(() =>
      secondMap.simulateBoundsChanged({ north: 48.87, south: 48.85, east: 2.36, west: 2.33 }),
    );
    await user.click(screen.getByRole("button", { name: "Liste" }));

    expect(listScrollContainer().scrollTop).toBe(0);
  });

  it("is a plain link to /carte when the restaurant was opened from outside the site", async () => {
    const user = userEvent.setup();
    renderSite(`/restaurant/${restaurantWithFullInfo.slug}`);

    const back = screen.getByRole("link", { name: "Retour à la carte" });
    expect(back).toHaveAttribute("href", "/carte");
    await user.click(back);

    expect(seenLocations.at(-1)?.pathname).toBe("/carte");
    expect(screen.getByRole("button", { name: "Carte" })).toHaveAttribute("aria-pressed", "true");
  });
});
