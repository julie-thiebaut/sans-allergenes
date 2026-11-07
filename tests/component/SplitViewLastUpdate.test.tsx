import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SplitView } from "../../src/components/layout/SplitView";
import type { RestaurantWithMenu } from "../../src/data/types";
import { MockMapsAdapter } from "../../src/maps/MockMapsAdapter";
import { MapsContext } from "../../src/maps/useMapsContext";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { MapActionsProvider } from "../../src/state/mapActionsContext";
import { MapBoundsProvider } from "../../src/state/mapBoundsContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import { restaurantWithFullInfo, restaurantWithUnknownInfo } from "../fixtures/restaurants.fixture";

function renderSplitView(allRestaurants: RestaurantWithMenu[]) {
  render(
    <MemoryRouter>
      <MapsContext.Provider
        value={{ configState: "enabled", createAdapter: async () => new MockMapsAdapter() }}
      >
        <FilterStateProvider>
          <MapBoundsProvider>
            <SelectionProvider>
              <MapActionsProvider>
                <SplitView allRestaurants={allRestaurants} />
              </MapActionsProvider>
            </SelectionProvider>
          </MapBoundsProvider>
        </FilterStateProvider>
      </MapsContext.Provider>
    </MemoryRouter>,
  );
}

describe("SplitView last update", () => {
  it("dates the catalog by the month of its most recent update, above the map", async () => {
    renderSplitView([
      { ...restaurantWithFullInfo, lastVerifiedAt: "2026-10-01T00:00:00Z" },
      { ...restaurantWithUnknownInfo, lastVerifiedAt: "2026-09-16T00:00:00Z" },
    ]);

    expect(await screen.findByText("Mise à jour : octobre 2026")).toBeInTheDocument();
    // Le compteur annoncé aux lecteurs d'écran à chaque filtre ne doit pas répéter la date.
    expect(screen.getByText(/restaurants? trouvés?/)).not.toHaveTextContent("Mise à jour");
  });

  it("shows no date when no restaurant has one", async () => {
    renderSplitView([{ ...restaurantWithFullInfo, lastVerifiedAt: undefined }]);

    expect(await screen.findByText(/restaurants? trouvés?/)).toBeInTheDocument();
    expect(screen.queryByText(/mise à jour/i)).not.toBeInTheDocument();
  });
});
