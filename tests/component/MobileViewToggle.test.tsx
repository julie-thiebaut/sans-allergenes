import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { MobileViewToggle } from "../../src/components/layout/MobileViewToggle";
import { SplitView } from "../../src/components/layout/SplitView";
import { MockMapsAdapter } from "../../src/maps/MockMapsAdapter";
import { MapsContext } from "../../src/maps/useMapsContext";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { MapBoundsProvider } from "../../src/state/mapBoundsContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import { restaurantWithFullInfo } from "../fixtures/restaurants.fixture";

function mockMobileViewport() {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: false, // "(min-width: 768px)" never matches -> forces mobile layout
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

function renderMobileSplitView() {
  mockMobileViewport();
  const mockAdapter = new MockMapsAdapter();
  return render(
    <MemoryRouter>
      <MapsContext.Provider
        value={{ configState: "enabled", createAdapter: async () => mockAdapter }}
      >
        <FilterStateProvider>
          <MapBoundsProvider>
            <SelectionProvider>
              <SplitView allRestaurants={[restaurantWithFullInfo]} />
            </SelectionProvider>
          </MapBoundsProvider>
        </FilterStateProvider>
      </MapsContext.Provider>
    </MemoryRouter>,
  );
}

describe("MobileViewToggle (standalone)", () => {
  it("calls onChange with the selected mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MobileViewToggle value="list" onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Carte" }));
    expect(onChange).toHaveBeenCalledWith("map");
  });
});

describe("SplitView mobile list/map switching", () => {
  it("mounts only the list, not the map, by default on mobile", () => {
    renderMobileSplitView();
    expect(screen.getByRole("link", { name: "Le Restaurant Complet" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Carte des restaurants")).not.toBeInTheDocument();
  });

  it("shows only the map, not the list, after tapping the Carte toggle", async () => {
    const user = userEvent.setup();
    renderMobileSplitView();

    await user.click(screen.getByRole("button", { name: "Carte" }));

    expect(screen.queryByRole("link", { name: "Le Restaurant Complet" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Carte des restaurants")).toBeInTheDocument();
  });
});
