import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Navbar } from "../../src/components/layout/Navbar";
import { MapView } from "../../src/components/map/MapView";
import { MockMapsAdapter } from "../../src/maps/MockMapsAdapter";
import { MapsContext } from "../../src/maps/useMapsContext";
import { MapActionsProvider } from "../../src/state/mapActionsContext";
import { MapBoundsProvider } from "../../src/state/mapBoundsContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import { restaurantWithFullInfo } from "../fixtures/restaurants.fixture";

function renderAppShell(mockAdapter: MockMapsAdapter) {
  return render(
    <MemoryRouter>
      <MapsContext.Provider
        value={{ configState: "enabled", createAdapter: async () => mockAdapter }}
      >
        <MapBoundsProvider>
          <SelectionProvider>
            <MapActionsProvider>
              <Navbar />
              <MapView restaurants={[restaurantWithFullInfo]} />
            </MapActionsProvider>
          </SelectionProvider>
        </MapBoundsProvider>
      </MapsContext.Provider>
    </MemoryRouter>,
  );
}

describe("Address search zooms the map", () => {
  it("submitting without picking a suggestion falls back to the top one already fetched", async () => {
    const mockAdapter = new MockMapsAdapter();
    mockAdapter.setSuggestions([{ placeId: "place-1", description: "10 Rue de Rivoli, Paris" }]);
    mockAdapter.setPlaceResult("place-1", { lat: 48.86, lng: 2.35 });
    const user = userEvent.setup();
    renderAppShell(mockAdapter);
    await screen.findByLabelText("Carte des restaurants");

    const input = screen.getByPlaceholderText(/rechercher une adresse/i);
    await user.type(input, "10 rue de Rivoli");
    await screen.findByRole("button", { name: "10 Rue de Rivoli, Paris" });
    await user.type(input, "{Enter}");

    await waitFor(() => expect(mockAdapter.getCenter()).toEqual({ lat: 48.86, lng: 2.35 }));
    expect(mockAdapter.getZoom()).toBe(15);
  });

  it("shows an 'adresse introuvable' hint when nothing was ever suggested", async () => {
    const mockAdapter = new MockMapsAdapter();
    const user = userEvent.setup();
    renderAppShell(mockAdapter);
    await screen.findByLabelText("Carte des restaurants");

    await user.type(screen.getByPlaceholderText(/rechercher une adresse/i), "inexistante{Enter}");

    expect(await screen.findByText(/adresse introuvable/i)).toBeInTheDocument();
  });

  it("shows debounced live suggestions and zooms to the one selected", async () => {
    const mockAdapter = new MockMapsAdapter();
    mockAdapter.setSuggestions([{ placeId: "place-1", description: "10 Rue de Rivoli, Paris" }]);
    mockAdapter.setPlaceResult("place-1", { lat: 48.86, lng: 2.36 });
    const user = userEvent.setup();
    renderAppShell(mockAdapter);
    await screen.findByLabelText("Carte des restaurants");

    await user.type(screen.getByPlaceholderText(/rechercher une adresse/i), "10 Rue de Rivoli");

    const suggestionButton = await screen.findByRole("button", { name: "10 Rue de Rivoli, Paris" });
    await user.click(suggestionButton);

    await waitFor(() => expect(mockAdapter.getCenter()).toEqual({ lat: 48.86, lng: 2.36 }));
    expect(mockAdapter.getZoom()).toBe(15);
  });
});
