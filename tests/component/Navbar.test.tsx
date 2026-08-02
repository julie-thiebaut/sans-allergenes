import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Navbar } from "../../src/components/layout/Navbar";
import { FilterStateProvider, useFilterState } from "../../src/state/FilterStateContext";

function FilterStateSpy() {
  const state = useFilterState();
  return <div data-testid="state">{JSON.stringify(state)}</div>;
}

describe("Navbar", () => {
  it("shows the site title and updates search text as the user types", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <FilterStateProvider>
          <Navbar />
          <FilterStateSpy />
        </FilterStateProvider>
      </MemoryRouter>,
    );

    // Title is split across two <span>s ("sans" in mustard, "Allergènes" plain) for
    // two-tone styling — no space between them visually, but the accessible-name algorithm
    // joins separate elements' text with a space, hence "sans Allergènes" here.
    const titleLink = screen.getByRole("link", { name: "sans Allergènes" });
    expect(titleLink).toHaveAttribute("href", "/");
    expect(container.querySelector("header")?.textContent).toContain("sansAllergènes");

    await user.type(screen.getByPlaceholderText(/rechercher par nom/i), "sushi");
    expect(screen.getByTestId("state")).toHaveTextContent('"searchText":"sushi"');
  });
});
