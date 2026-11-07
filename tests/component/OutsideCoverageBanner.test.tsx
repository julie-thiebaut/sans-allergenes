import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SplitView } from "../../src/components/layout/SplitView";
import { DEFAULT_FILTER_STATE, type FilterState } from "../../src/filtering/filterRestaurants";
import type { MapBoundsLiteral } from "../../src/maps/MapsAdapter";
import { MockMapsAdapter } from "../../src/maps/MockMapsAdapter";
import { MapsContext } from "../../src/maps/useMapsContext";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { MapActionsProvider } from "../../src/state/mapActionsContext";
import { MapBoundsProvider } from "../../src/state/mapBoundsContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import { restaurantWithFullInfo } from "../fixtures/restaurants.fixture";

const CHATELET = { latitude: 48.8584, longitude: 2.347 };
const AROUND_CHATELET: MapBoundsLiteral = {
  north: 48.87,
  south: 48.85,
  east: 2.36,
  west: 2.33,
};
// A few streets away: empty, but less than a kilometre from the restaurant.
const NEXT_TO_CHATELET: MapBoundsLiteral = {
  north: 48.8642,
  south: 48.8602,
  east: 2.3512,
  west: 2.3452,
};
const LYON: MapBoundsLiteral = { north: 45.78, south: 45.75, east: 4.86, west: 4.81 };

const BANNER_TEXT = /dans un nombre limité de villes/;
const FILTERS_MESSAGE = /élargir vos filtres/;

function renderSplitView({
  filters = DEFAULT_FILTER_STATE,
  desktop = true,
}: { filters?: FilterState; desktop?: boolean } = {}) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: desktop,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
  const adapter = new MockMapsAdapter();
  render(
    <MemoryRouter>
      <MapsContext.Provider value={{ configState: "enabled", createAdapter: async () => adapter }}>
        <FilterStateProvider initialState={filters}>
          <MapBoundsProvider>
            <SelectionProvider>
              <MapActionsProvider>
                <SplitView allRestaurants={[{ ...restaurantWithFullInfo, ...CHATELET }]} />
              </MapActionsProvider>
            </SelectionProvider>
          </MapBoundsProvider>
        </FilterStateProvider>
      </MapsContext.Provider>
    </MemoryRouter>,
  );
  return adapter;
}

async function moveMapTo(adapter: MockMapsAdapter, bounds: MapBoundsLiteral) {
  // The bounds listener only exists once the map has mounted, and the markers can't tell: the
  // filters may leave none to place.
  await waitFor(() =>
    expect(screen.queryByText("Chargement de la carte…")).not.toBeInTheDocument(),
  );
  await act(async () => {
    await Promise.resolve();
  });
  act(() => adapter.simulateBoundsChanged(bounds));
}

afterEach(() => vi.restoreAllMocks());

describe("the banner shown when the map looks outside Paris", () => {
  it("invites the visitor to write, above the list's own empty message", async () => {
    const adapter = renderSplitView();
    await moveMapTo(adapter, LYON);

    expect(await screen.findByText(BANNER_TEXT)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "contact@sans-allergenes.fr" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:contact@sans-allergenes.fr"),
    );
    expect(screen.getByText(FILTERS_MESSAGE)).toBeInTheDocument();
  });

  it("also shows on a phone's map view, which has no list", async () => {
    const adapter = renderSplitView({ desktop: false });
    await moveMapTo(adapter, LYON);

    expect(await screen.findByText(BANNER_TEXT)).toBeInTheDocument();
  });

  it("goes away when the map comes back to Paris", async () => {
    const adapter = renderSplitView();
    await moveMapTo(adapter, LYON);
    await screen.findByText(BANNER_TEXT);

    act(() => adapter.simulateBoundsChanged(AROUND_CHATELET));

    await waitFor(() => expect(screen.queryByText(BANNER_TEXT)).not.toBeInTheDocument());
    expect(screen.getByRole("list", { name: "Liste des restaurants" })).toBeInTheDocument();
  });

  it("stays hidden on an empty stretch of Paris", async () => {
    const adapter = renderSplitView();
    await moveMapTo(adapter, NEXT_TO_CHATELET);

    expect(await screen.findByText(FILTERS_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(BANNER_TEXT)).not.toBeInTheDocument();
  });

  it("stays hidden when it is the filters that empty the list in Paris", async () => {
    const adapter = renderSplitView({
      filters: { ...DEFAULT_FILTER_STATE, cuisineTypes: ["Cuisine introuvable"] },
    });
    await moveMapTo(adapter, AROUND_CHATELET);

    expect(await screen.findByText(FILTERS_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(BANNER_TEXT)).not.toBeInTheDocument();
  });

  it("stays hidden until the map has said where it is looking", () => {
    renderSplitView();

    expect(screen.queryByText(BANNER_TEXT)).not.toBeInTheDocument();
  });
});
