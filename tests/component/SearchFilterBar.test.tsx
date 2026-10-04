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

  it("toggles the exclusion of traces", async () => {
    const user = userEvent.setup();
    render(
      <FilterStateProvider>
        <SearchFilterBar />
        <FilterStateSpy />
      </FilterStateProvider>,
    );

    await user.click(screen.getByRole("checkbox", { name: /exclure les traces possibles/i }));
    expect(screen.getByTestId("state")).toHaveTextContent('"excludeTraces":true');
    expect(screen.getByText(/comme présent ou en traces\./)).toBeInTheDocument();
  });

  it("speaks of the allergens in the plural once several are selected", async () => {
    const user = userEvent.setup();
    render(
      <FilterStateProvider>
        <SearchFilterBar />
      </FilterStateProvider>,
    );

    expect(screen.getByText(/déclarent cet allergène comme présent\./)).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Gluten" }));
    await user.click(screen.getByRole("checkbox", { name: "Lait" }));
    expect(
      screen.getByText(/déclarent l’un de ces allergènes comme présent\./),
    ).toBeInTheDocument();
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
    await user.click(screen.getByRole("checkbox", { name: /exclure les traces possibles/i }));
    await user.click(screen.getByRole("button", { name: /réinitialiser/i }));

    expect(screen.getByTestId("state")).toHaveTextContent('"vegetarianOnly":false');
    expect(screen.getByTestId("state")).toHaveTextContent('"allergensToAvoid":[]');
    expect(screen.getByTestId("state")).toHaveTextContent('"excludeTraces":false');
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
