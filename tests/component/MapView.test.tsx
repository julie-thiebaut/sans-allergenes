import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MapView } from "../../src/components/map/MapView";
import { MockMapsAdapter } from "../../src/maps/MockMapsAdapter";
import { MapsContext } from "../../src/maps/useMapsContext";
import { MapActionsProvider } from "../../src/state/mapActionsContext";
import { MapBoundsProvider, useMapBoundsContext } from "../../src/state/mapBoundsContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../fixtures/restaurants.fixture";

function BoundsSpy() {
  const { bounds } = useMapBoundsContext();
  return <div data-testid="bounds">{bounds ? JSON.stringify(bounds) : "null"}</div>;
}

function renderMapView(
  mockAdapter: MockMapsAdapter,
  restaurants = [restaurantWithFullInfo, restaurantWithoutAllergenInfo],
) {
  return render(
    <MemoryRouter>
      <MapsContext.Provider
        value={{ configState: "enabled", createAdapter: async () => mockAdapter }}
      >
        <MapBoundsProvider>
          <SelectionProvider>
            <MapActionsProvider>
              <MapView restaurants={restaurants} />
              <BoundsSpy />
            </MapActionsProvider>
          </SelectionProvider>
        </MapBoundsProvider>
      </MapsContext.Provider>
    </MemoryRouter>,
  );
}

describe("MapView (MockMapsAdapter — no real Google Maps call)", () => {
  it("mounts the adapter and registers one marker per restaurant", async () => {
    const mockAdapter = new MockMapsAdapter();
    renderMapView(mockAdapter);
    await waitFor(() =>
      expect(mockAdapter.getMarkerIds().sort()).toEqual(
        [restaurantWithFullInfo.id, restaurantWithoutAllergenInfo.id].sort(),
      ),
    );
  });

  it("highlights a marker on click without navigating away from the list", async () => {
    const mockAdapter = new MockMapsAdapter();
    renderMapView(mockAdapter);
    await waitFor(() => expect(mockAdapter.getMarkerIds()).toHaveLength(2));

    act(() => mockAdapter.simulateMarkerClick(restaurantWithFullInfo.id));

    await waitFor(() =>
      expect(mockAdapter.isMarkerHighlighted(restaurantWithFullInfo.id)).toBe(true),
    );
    expect(mockAdapter.isMarkerHighlighted(restaurantWithoutAllergenInfo.id)).toBe(false);
  });

  it("shows a preview card for the selected marker, and dismissing it clears the selection", async () => {
    const mockAdapter = new MockMapsAdapter();
    renderMapView(mockAdapter);
    await waitFor(() => expect(mockAdapter.getMarkerIds()).toHaveLength(2));

    act(() => mockAdapter.simulateMarkerClick(restaurantWithFullInfo.id));

    expect(await screen.findByText(restaurantWithFullInfo.name)).toBeInTheDocument();
    expect(screen.queryByText(restaurantWithoutAllergenInfo.name)).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /fermer l'aperçu/i }));

    expect(screen.queryByText(restaurantWithFullInfo.name)).not.toBeInTheDocument();
  });

  it("propagates pan/zoom bounds changes so the list can be clipped to the visible area", async () => {
    const mockAdapter = new MockMapsAdapter();
    renderMapView(mockAdapter, [restaurantWithFullInfo]);
    await waitFor(() => expect(mockAdapter.getMarkerIds()).toHaveLength(1));

    act(() => mockAdapter.simulateBoundsChanged({ north: 49, south: 48, east: 3, west: 2 }));

    await waitFor(() => expect(screen.getByTestId("bounds")).toHaveTextContent('"north":49'));
  });
});
