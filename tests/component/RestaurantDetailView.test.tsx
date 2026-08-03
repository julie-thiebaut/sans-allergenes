import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { DataContext } from "../../src/data/DataProvider";
import { RestaurantDetailPage } from "../../src/routes/RestaurantDetailPage";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { allFixtureRestaurants } from "../fixtures/restaurants.fixture";

function renderDetailPage(initialPath: string) {
  return render(
    <DataContext.Provider value={{ status: "ready", restaurants: allFixtureRestaurants }}>
      <FilterStateProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/" element={<div>Page d&apos;accueil</div>} />
            <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
          </Routes>
        </MemoryRouter>
      </FilterStateProvider>
    </DataContext.Provider>,
  );
}

describe("RestaurantDetailPage (open/close)", () => {
  it("opens and shows the restaurant's menu, allergen info and safety disclaimer", () => {
    renderDetailPage("/restaurant/le-restaurant-complet");
    expect(screen.getByRole("heading", { name: "Le Restaurant Complet" })).toBeInTheDocument();
    expect(screen.getByText("Plat au blé")).toBeInTheDocument();
    expect(screen.getByText(/informations présentées sont indicatives/i)).toBeInTheDocument();
  });

  it("shows the disclaimer even when allergen info is unavailable for the restaurant", () => {
    renderDetailPage("/restaurant/le-bistrot-sans-info");
    expect(screen.getByText(/informations présentées sont indicatives/i)).toBeInTheDocument();
    expect(
      screen.getByText(/aucune information sur les allergènes n.est disponible/i),
    ).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown slug", () => {
    renderDetailPage("/restaurant/does-not-exist");
    expect(screen.getByText(/restaurant introuvable/i)).toBeInTheDocument();
  });

  it("lists each dish's allergens under the status it actually has", () => {
    renderDetailPage("/restaurant/le-restaurant-complet");

    // "Plat au blé": gluten present, lait may_contain, the other 12 not_declared. Scoped to the
    // dish's own chip lists, since the page's avoidance filter legitimately lists all 14.
    const present = within(screen.getByLabelText("Allergènes présents dans Plat au blé"));
    expect(present.getByText("Gluten")).toBeInTheDocument();
    expect(present.queryByText(/Céleri|Lait/)).not.toBeInTheDocument();

    const traces = within(screen.getByLabelText("Traces possibles dans Plat au blé"));
    expect(traces.getByText("Lait")).toBeInTheDocument();
  });

  it("always carries the disclaimer that missing information is not a guarantee", () => {
    renderDetailPage("/restaurant/le-restaurant-complet");
    expect(
      screen.getByText(/absence d.information ne signifie pas une absence d.allergène/i),
    ).toBeInTheDocument();
  });

  it("filters the menu by allergen without implying the remaining dishes are safe", async () => {
    const user = userEvent.setup();
    renderDetailPage("/restaurant/le-restaurant-complet");
    expect(screen.getByText("Plat au blé")).toBeInTheDocument();

    // Default (mocked) viewport is mobile, so the filter lives behind the sheet button.
    await user.click(screen.getByRole("button", { name: "Filtrer par allergènes" }));
    await user.click(screen.getByRole("checkbox", { name: /gluten/i }));
    await user.click(screen.getByRole("button", { name: /fermer les filtres/i }));

    // Confirmed "present" dish is hidden, and the page says out loud that it hid something.
    expect(screen.queryByText("Plat au blé")).not.toBeInTheDocument();
    expect(screen.getByText(/1 plat masqué/)).toBeInTheDocument();
    // The dish that merely lacks data stays visible — it is not a "safe" result.
    expect(screen.getByText("Salade simple")).toBeInTheDocument();
    expect(screen.queryByText(/\bsafe\b|sûr|sans risque/i)).not.toBeInTheDocument();
  });

  it("closes back to the list via the back link", async () => {
    const user = userEvent.setup();
    renderDetailPage("/restaurant/le-restaurant-complet");
    await user.click(screen.getByRole("link", { name: /retour à la liste/i }));
    expect(await screen.findByText("Page d'accueil")).toBeInTheDocument();
  });
});
