import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { DataContext } from "../../src/data/DataProvider";
import { RestaurantDetailPage } from "../../src/routes/RestaurantDetailPage";
import { allFixtureRestaurants } from "../fixtures/restaurants.fixture";

function renderDetailPage(initialPath: string) {
  return render(
    <DataContext.Provider value={{ status: "ready", restaurants: allFixtureRestaurants }}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<div>Page d&apos;accueil</div>} />
          <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
        </Routes>
      </MemoryRouter>
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

  it("closes back to the list via the back link", async () => {
    const user = userEvent.setup();
    renderDetailPage("/restaurant/le-restaurant-complet");
    await user.click(screen.getByRole("link", { name: /retour à la liste/i }));
    expect(await screen.findByText("Page d'accueil")).toBeInTheDocument();
  });
});
