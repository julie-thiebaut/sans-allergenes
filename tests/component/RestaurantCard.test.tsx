import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { RestaurantCard } from "../../src/components/restaurant-list/RestaurantCard";
import type { RestaurantWithMenu } from "../../src/data/types";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
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
