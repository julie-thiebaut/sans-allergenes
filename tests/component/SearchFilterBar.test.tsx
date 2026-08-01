import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SearchFilterBar } from "../../src/components/filters/SearchFilterBar";
import { FilterStateProvider, useFilterState } from "../../src/state/FilterStateContext";
import { allFixtureRestaurants } from "../fixtures/restaurants.fixture";

function FilterStateSpy() {
  const state = useFilterState();
  return <div data-testid="state">{JSON.stringify(state)}</div>;
}

describe("SearchFilterBar", () => {
  it("updates search text as the user types", async () => {
    const user = userEvent.setup();
    render(
      <FilterStateProvider>
        <SearchFilterBar allRestaurants={allFixtureRestaurants} />
        <FilterStateSpy />
      </FilterStateProvider>,
    );

    await user.type(screen.getByPlaceholderText(/rechercher par nom/i), "sushi");
    expect(screen.getByTestId("state")).toHaveTextContent('"searchText":"sushi"');
  });

  it("resets all filters back to defaults", async () => {
    const user = userEvent.setup();
    render(
      <FilterStateProvider>
        <SearchFilterBar allRestaurants={allFixtureRestaurants} />
        <FilterStateSpy />
      </FilterStateProvider>,
    );

    await user.type(screen.getByPlaceholderText(/rechercher par nom/i), "sushi");
    await user.click(screen.getByRole("checkbox", { name: /options végétariennes/i }));
    await user.click(screen.getByRole("button", { name: /réinitialiser/i }));

    expect(screen.getByTestId("state")).toHaveTextContent('"searchText":""');
    expect(screen.getByTestId("state")).toHaveTextContent('"vegetarianOnly":false');
  });

  it("lists cuisine types derived from the given restaurants", () => {
    render(
      <FilterStateProvider>
        <SearchFilterBar allRestaurants={allFixtureRestaurants} />
      </FilterStateProvider>,
    );
    expect(screen.getByText("Française")).toBeInTheDocument();
    expect(screen.getByText("Fusion")).toBeInTheDocument();
  });
});
