import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { RestaurantCard } from "../../src/components/restaurant-list/RestaurantCard";
import type { AllergenId, RestaurantWithMenu } from "../../src/data/types";
import { FilterStateProvider, useFilterDispatch } from "../../src/state/FilterStateContext";
import { SelectionProvider } from "../../src/state/SelectionContext";
import { menuWithDrinks } from "../fixtures/menu.fixture";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
  restaurantWithUnknownInfo,
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
      "/restaurant/le-restaurant-complet/",
    );
  });

  // L'adresse complète situe le restaurant dans n'importe quelle ville ; l'arrondissement ne
  // valait que pour Paris.
  it("situates the restaurant by its full address, not its arrondissement", () => {
    renderCard();
    expect(screen.getByText("1 rue de Test, 75001 Paris")).toBeInTheDocument();
    expect(screen.queryByText(/arrondissement/i)).not.toBeInTheDocument();
  });

  it("indicates when allergen info is unavailable", () => {
    renderCard(restaurantWithoutAllergenInfo);
    expect(screen.getByText(/infos allergènes non disponibles/i)).toBeInTheDocument();
  });

  // Sans allergènes, « Vérifié le » se lirait comme un gage : la date reste sur la fiche seule.
  it("shows the verification date only when allergen info exists", () => {
    const verifiedAt = "2026-08-10T00:00:00Z";
    renderCard({ ...restaurantWithoutAllergenInfo, lastVerifiedAt: verifiedAt });
    expect(screen.queryByText(/vérifié le/i)).not.toBeInTheDocument();
    renderCard({ ...restaurantWithFullInfo, lastVerifiedAt: verifiedAt });
    expect(screen.getByText(/vérifié le 10 août 2026/i)).toBeInTheDocument();
  });

  // Quand l'information existe, la carte n'en dit rien : ni sa provenance, ni sa simple existence.
  it("says nothing more when allergen info exists", () => {
    renderCard(restaurantWithFullInfo);
    expect(screen.queryByText(/allergènes publiés en ligne/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/infos allergènes disponibles/i)).not.toBeInTheDocument();
  });

  // Les régimes restent sur la fiche du restaurant, pas dans la liste.
  it("leaves the diets off the card", () => {
    renderCard(restaurantWithUnknownInfo);
    expect(screen.getByText("Fusion")).toBeInTheDocument();
    expect(screen.queryByText(/végétarien|végétalien|végane?|carnés/i)).not.toBeInTheDocument();
  });

  it("shows the demo data badge for fixture restaurants", () => {
    renderCard();
    expect(screen.getByText(/donnée de démonstration/i)).toBeInTheDocument();
  });
});

describe("RestaurantCard with an avoided allergen selected", () => {
  function renderWithAvoidance(
    restaurant: RestaurantWithMenu,
    avoid: AllergenId[] = ["gluten"],
    excludeTraces = false,
  ) {
    function SetAvoidance() {
      const dispatch = useFilterDispatch();
      useEffect(() => {
        dispatch({ type: "SET_ALLERGENS_TO_AVOID", value: avoid });
        dispatch({ type: "SET_EXCLUDE_TRACES", value: excludeTraces });
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

  it("says how many dishes are left once the avoided allergen is set aside", () => {
    // fullInfoMenu: 2 dishes, 1 of which ("Plat au blé") declares gluten. The restaurant stays
    // listed, so the card has to be upfront about what is waiting inside.
    renderWithAvoidance(restaurantWithFullInfo);
    expect(
      screen.getByText("1 plat sur 2 ne déclare pas l’allergène à éviter"),
    ).toBeInTheDocument();
  });

  it("leaves the drinks out of the count", () => {
    // menuWithDrinks: the same 2 dishes, plus a beer that declares gluten and a water.
    renderWithAvoidance({ ...restaurantWithFullInfo, menu: menuWithDrinks });
    expect(
      screen.getByText("1 plat sur 2 ne déclare pas l’allergène à éviter"),
    ).toBeInTheDocument();
  });

  it("leaves traces off the card", () => {
    // fullInfoMenu: "Plat au blé" declares traces of milk, "Salade simple" declares nothing.
    renderWithAvoidance(restaurantWithFullInfo, ["lait"]);
    expect(screen.queryByText(/traces/i)).not.toBeInTheDocument();
    expect(screen.getByText("Aucun plat ne déclare l’allergène à éviter")).toBeInTheDocument();
  });

  it("speaks of the allergens in the plural when several are avoided", () => {
    // fullInfoMenu: "Plat au blé" declares gluten, "Salade simple" neither gluten nor celery.
    renderWithAvoidance(restaurantWithFullInfo, ["gluten", "celeri"]);
    expect(
      screen.getByText("1 plat sur 2 ne déclare aucun des allergènes à éviter"),
    ).toBeInTheDocument();
  });

  it("says no dish declares them, in the plural, when several are avoided", () => {
    renderWithAvoidance(restaurantWithFullInfo, ["celeri", "moutarde"]);
    expect(screen.getByText("Aucun plat ne déclare les allergènes à éviter")).toBeInTheDocument();
  });

  it("counts a dish with traces as declaring the allergen once traces are excluded", () => {
    renderWithAvoidance(restaurantWithFullInfo, ["lait"], true);
    expect(
      screen.getByText("1 plat sur 2 ne déclare pas l’allergène à éviter"),
    ).toBeInTheDocument();
  });

  it("says when no dish declares the allergen, without calling the information incomplete", () => {
    renderWithAvoidance(restaurantWithFullInfo, ["celeri"]);
    expect(screen.getByText("Aucun plat ne déclare l’allergène à éviter")).toBeInTheDocument();
    expect(screen.queryByText(/information incomplète/i)).not.toBeInTheDocument();
  });

  it("calls the information incomplete when the document doesn't cover the allergen", () => {
    renderWithAvoidance(restaurantWithUnknownInfo);
    expect(
      screen.getByText("Information incomplète pour l’allergène à éviter"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/déclare.*l’allergène à éviter/)).not.toBeInTheDocument();
  });

  it("calls the information incomplete when there is no menu at all", () => {
    renderWithAvoidance(restaurantWithoutAllergenInfo);
    expect(
      screen.getByText("Information incomplète pour l’allergène à éviter"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/déclare.*l’allergène à éviter/)).not.toBeInTheDocument();
  });
});
