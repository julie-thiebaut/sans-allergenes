import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "../../src/analytics/googleAnalytics";
import { RestaurantCard } from "../../src/components/restaurant-list/RestaurantCard";
import { DataContext } from "../../src/data/DataProvider";
import { RestaurantDetailPage } from "../../src/routes/RestaurantDetailPage";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import { allFixtureRestaurants, restaurantWithFullInfo } from "../fixtures/restaurants.fixture";

vi.mock("../../src/analytics/googleAnalytics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../src/analytics/googleAnalytics")>()),
  trackEvent: vi.fn(),
}));

// jsdom cannot follow mailto: or tel: links; the click handlers still run.
const preventNavigation = (event: Event) => event.preventDefault();

function renderDetailPage(slug: string, restaurants = allFixtureRestaurants) {
  return render(
    <DataContext.Provider value={{ status: "ready", restaurants }}>
      <FilterStateProvider>
        <MemoryRouter initialEntries={[`/restaurant/${slug}`]}>
          <Routes>
            <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
          </Routes>
        </MemoryRouter>
      </FilterStateProvider>
    </DataContext.Provider>,
  );
}

describe("Analytics events", () => {
  beforeEach(() => {
    vi.mocked(trackEvent).mockClear();
    document.addEventListener("click", preventNavigation);
  });

  afterEach(() => {
    document.removeEventListener("click", preventNavigation);
  });

  it("counts a request to publish the allergens", () => {
    renderDetailPage("le-bistrot-sans-info");
    fireEvent.click(screen.getByRole("link", { name: "Écrire au restaurant" }));
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith("ask_to_publish");
  });

  it("counts a problem report", () => {
    renderDetailPage("le-restaurant-complet");
    fireEvent.click(screen.getByRole("link", { name: /signaler un problème/i }));
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith("report_problem");
  });

  it("makes the phone number a link to dial, and counts the call", () => {
    const withPhone = { ...restaurantWithFullInfo, phone: "01 57 97 01 91" };
    renderDetailPage("le-restaurant-complet", [withPhone]);
    const phone = screen.getByRole("link", { name: "01 57 97 01 91" });
    expect(phone).toHaveAttribute("href", "tel:0157970191");
    fireEvent.click(phone);
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith("call_restaurant");
  });

  it("counts a restaurant opened from the list", () => {
    render(
      <MemoryRouter>
        <FilterStateProvider>
          <SelectionProvider>
            <RestaurantCard restaurant={restaurantWithFullInfo} />
          </SelectionProvider>
        </FilterStateProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Le Restaurant Complet" }));
    expect(trackEvent).toHaveBeenCalledExactlyOnceWith("open_restaurant_from_list");
  });
});
