import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { RestaurantCard } from "../../src/components/restaurant-list/RestaurantCard";
import type { RestaurantWithMenu } from "../../src/data/types";
import { FilterStateProvider, useFilterDispatch } from "../../src/state/FilterStateContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../fixtures/restaurants.fixture";

function renderCard(restaurant: RestaurantWithMenu = restaurantWithFullInfo) {
  return render(
    <MemoryRouter>
      <FilterStateProvider>
        <SelectionProvider>
          <RestaurantCard restaurant={restaurant} />
        </SelectionProvider>
      </FilterStateProvider>
    </MemoryRouter>,
  );
}

describe("RestaurantCard", () => {
  it("links to the restaurant detail page", () => {
    renderCard();
    expect(screen.getByRole("link", { name: "Le Restaurant Complet" })).toHaveAttribute(
      "href",
      "/restaurant/le-restaurant-complet",
    );
  });

  it("indicates when allergen info is unavailable", () => {
    renderCard(restaurantWithoutAllergenInfo);
    expect(screen.getByText(/infos allergènes non disponibles/i)).toBeInTheDocument();
  });

  it("indicates when allergen info is available", () => {
    renderCard(restaurantWithFullInfo);
    expect(screen.getByText(/infos allergènes disponibles/i)).toBeInTheDocument();
  });

  it("shows the demo data badge for fixture restaurants", () => {
    renderCard();
    expect(screen.getByText(/donnée de démonstration/i)).toBeInTheDocument();
  });
});

describe("RestaurantCard with an avoided allergen selected", () => {
  function renderWithAvoidance(restaurant: RestaurantWithMenu) {
    function SetAvoidance() {
      const dispatch = useFilterDispatch();
      useEffect(() => {
        dispatch({ type: "SET_ALLERGENS_TO_AVOID", value: ["gluten"] });
      }, [dispatch]);
      return null;
    }
    return render(
      <MemoryRouter>
        <FilterStateProvider>
          <SelectionProvider>
            <SetAvoidance />
            <RestaurantCard restaurant={restaurant} />
          </SelectionProvider>
        </FilterStateProvider>
      </MemoryRouter>,
    );
  }

  it("says how many dishes declare the avoided allergen", () => {
    // fullInfoMenu: 2 dishes, 1 of which ("Plat au blé") declares gluten. The restaurant stays
    // listed, so the card has to be upfront about what is waiting inside.
    renderWithAvoidance(restaurantWithFullInfo);
    expect(screen.getByText(/1 plat sur 2 déclare l’allergène à éviter/)).toBeInTheDocument();
  });

  it("says nothing of the sort when no dish declares it", () => {
    renderWithAvoidance(restaurantWithoutAllergenInfo);
    expect(screen.queryByText(/déclare.*l’allergène à éviter/)).not.toBeInTheDocument();
  });
});
