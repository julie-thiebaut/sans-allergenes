import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SearchFilterBar } from "../../src/components/filters/SearchFilterBar";
import { FilterStateProvider, useFilterState } from "../../src/state/FilterStateContext";

function FilterStateSpy() {
  const state = useFilterState();
  return <div data-testid="state">{JSON.stringify(state)}</div>;
}

describe("SearchFilterBar", () => {
  it("toggles the vegetarian filter", async () => {
    const user = userEvent.setup();
    render(
      <FilterStateProvider>
        <SearchFilterBar />
        <FilterStateSpy />
      </FilterStateProvider>,
    );

    await user.click(screen.getByRole("checkbox", { name: /options végétariennes/i }));
    expect(screen.getByTestId("state")).toHaveTextContent('"vegetarianOnly":true');
  });

  it("resets all filters back to defaults", async () => {
    const user = userEvent.setup();
    render(
      <FilterStateProvider>
        <SearchFilterBar />
        <FilterStateSpy />
      </FilterStateProvider>,
    );

    await user.click(screen.getByRole("checkbox", { name: /options végétariennes/i }));
    await user.click(screen.getByRole("checkbox", { name: "Gluten" }));
    await user.click(screen.getByRole("button", { name: /réinitialiser/i }));

    expect(screen.getByTestId("state")).toHaveTextContent('"vegetarianOnly":false');
    expect(screen.getByTestId("state")).toHaveTextContent('"allergensToAvoid":[]');
  });

  it("no longer offers a cuisine-type filter (removed in favor of free-text search)", () => {
    render(
      <FilterStateProvider>
        <SearchFilterBar />
      </FilterStateProvider>,
    );
    expect(screen.queryByText(/type de cuisine/i)).not.toBeInTheDocument();
  });
});
