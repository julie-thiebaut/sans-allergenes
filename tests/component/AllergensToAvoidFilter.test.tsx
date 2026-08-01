import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AllergensToAvoidFilter } from "../../src/components/filters/AllergensToAvoidFilter";
import { FilterStateProvider } from "../../src/state/FilterStateContext";

function renderFilter() {
  return render(
    <FilterStateProvider>
      <AllergensToAvoidFilter />
    </FilterStateProvider>,
  );
}

describe("AllergensToAvoidFilter", () => {
  it("renders all 14 EU allergens as toggleable options", () => {
    renderFilter();
    expect(screen.getAllByRole("checkbox")).toHaveLength(14);
  });

  it("toggles an allergen selection on click", async () => {
    const user = userEvent.setup();
    renderFilter();
    const glutenCheckbox = screen.getByRole("checkbox", { name: "Gluten" });
    expect(glutenCheckbox).not.toBeChecked();
    await user.click(glutenCheckbox);
    expect(glutenCheckbox).toBeChecked();
    await user.click(glutenCheckbox);
    expect(glutenCheckbox).not.toBeChecked();
  });

  it("never claims a restaurant/dish is safe, regardless of how many allergens are selected", async () => {
    const user = userEvent.setup();
    renderFilter();
    for (const checkbox of screen.getAllByRole("checkbox")) {
      await user.click(checkbox);
    }
    expect(screen.queryByText(/\bsafe\b|sûr|sans risque/i)).not.toBeInTheDocument();
  });
});
