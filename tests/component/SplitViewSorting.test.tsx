import { act, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SplitView } from "../../src/components/layout/SplitView";
import { MockMapsAdapter } from "../../src/maps/MockMapsAdapter";
import { MapsContext } from "../../src/maps/useMapsContext";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { MapActionsProvider } from "../../src/state/mapActionsContext";
import { MapBoundsProvider } from "../../src/state/mapBoundsContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../fixtures/restaurants.fixture";

afterEach(() => vi.restoreAllMocks());

describe("SplitView restaurant ordering", () => {
  it("reorders visible restaurants when the centre of the map moves", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: query === "(min-width: 768px)",
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList,
    );

    const westRestaurant = {
      ...restaurantWithFullInfo,
      id: "west",
      name: "Restaurant Ouest",
      slug: "restaurant-ouest",
      latitude: 48.8566,
      longitude: 2.34,
    };
    const eastRestaurant = {
      ...restaurantWithoutAllergenInfo,
      id: "east",
      name: "Restaurant Est",
      slug: "restaurant-est",
      latitude: 48.8566,
      longitude: 2.36,
    };
    const mockAdapter = new MockMapsAdapter();

    render(
      <MemoryRouter>
        <MapsContext.Provider
          value={{ configState: "enabled", createAdapter: async () => mockAdapter }}
        >
          <FilterStateProvider>
            <MapBoundsProvider>
              <SelectionProvider>
                <MapActionsProvider>
                  <SplitView allRestaurants={[eastRestaurant, westRestaurant]} />
                </MapActionsProvider>
              </SelectionProvider>
            </MapBoundsProvider>
          </FilterStateProvider>
        </MapsContext.Provider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(mockAdapter.getMarkerIds()).toHaveLength(2));
    const list = screen.getByRole("list", { name: "Liste des restaurants" });
    const restaurantNames = () =>
      within(list)
        .getAllByRole("link")
        .map((link) => link.textContent);

    act(() =>
      mockAdapter.simulateBoundsChanged({
        north: 48.87,
        south: 48.84,
        east: 2.37,
        west: 2.31,
      }),
    );
    await waitFor(() => expect(restaurantNames()).toEqual(["Restaurant Ouest", "Restaurant Est"]));

    act(() =>
      mockAdapter.simulateBoundsChanged({
        north: 48.87,
        south: 48.84,
        east: 2.39,
        west: 2.33,
      }),
    );
    await waitFor(() => expect(restaurantNames()).toEqual(["Restaurant Est", "Restaurant Ouest"]));
  });
});
