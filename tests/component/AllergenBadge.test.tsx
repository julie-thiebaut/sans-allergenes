import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AllergenBadge } from "../../src/components/restaurant-detail/AllergenBadge";
import { DishRow } from "../../src/components/restaurant-detail/DishRow";
import { makeAllergenMap } from "../fixtures/menu.fixture";

const dish = {
  id: "dish-1",
  name: "Plat test",
  price: 10,
  allergens: makeAllergenMap({ gluten: "present", lait: "may_contain", soja: "unknown" }),
};

describe("AllergenBadge", () => {
  it("names the allergen in text, not by colour or icon alone", () => {
    render(<AllergenBadge allergenId="gluten" />);
    expect(screen.getByText("Gluten")).toBeInTheDocument();
  });
});

describe("DishRow allergen grouping", () => {
  it("states each status in words under its own heading", () => {
    render(<DishRow dish={dish} />);
    expect(screen.getByText("Présent :")).toBeInTheDocument();
    expect(screen.getByText("Traces possibles :")).toBeInTheDocument();
  });

  it("puts each allergen under the status it actually has", () => {
    render(<DishRow dish={dish} />);

    const present = screen.getByLabelText("Allergènes présents dans Plat test");
    expect(present).toHaveTextContent("Gluten");
    expect(present).not.toHaveTextContent("Lait");

    const traces = screen.getByLabelText("Traces possibles dans Plat test");
    expect(traces).toHaveTextContent("Lait");
    expect(traces).not.toHaveTextContent("Gluten");
  });

  it("lists no allergen that carries no information", () => {
    render(<DishRow dish={dish} />);
    // soja is "unknown" and the remaining 11 are "not_declared" — none may appear as a chip,
    // which would read as a declaration the data doesn't support.
    expect(screen.queryByText("Soja")).not.toBeInTheDocument();
    expect(screen.queryByText("Céleri")).not.toBeInTheDocument();
  });

  it("never renders wording implying a confirmed safety guarantee", () => {
    render(<DishRow dish={dish} />);
    expect(screen.queryByText(/\bsafe\b|sûr|sans risque|garanti/i)).not.toBeInTheDocument();
  });

  it("reports an empty declaration as such, without claiming the dish is allergen-free", () => {
    render(<DishRow dish={{ ...dish, name: "Plat inconnu", allergens: makeAllergenMap() }} />);
    expect(screen.queryByText("Présent :")).not.toBeInTheDocument();
    expect(screen.queryByText("Traces possibles :")).not.toBeInTheDocument();

    // The wording must attribute the absence to the restaurant's declaration — "aucun
    // allergène" on its own would read as a guarantee the data cannot support.
    expect(screen.getByText(/Aucun allergène signalé par le restaurant/)).toBeInTheDocument();
    expect(screen.queryByText(/\bsafe\b|sûr|sans risque|garanti|sans allergène/i)).toBeNull();
  });
});
