import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Navbar } from "../../src/components/layout/Navbar";
import { MapActionsProvider } from "../../src/state/mapActionsContext";

describe("Navbar", () => {
  it("shows the site title linking home, and an address search box", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <MapActionsProvider>
          <Navbar />
        </MapActionsProvider>
      </MemoryRouter>,
    );

    // Title is split across two <span>s ("sans" in mustard, "Allergènes" plain) for
    // two-tone styling — no space between them visually, but the accessible-name algorithm
    // joins separate elements' text with a space, hence "sans Allergènes" here.
    const titleLink = screen.getByRole("link", { name: "sans Allergènes" });
    expect(titleLink).toHaveAttribute("href", "/");
    expect(container.querySelector("header")?.textContent).toContain("sansAllergènes");

    const search = screen.getByPlaceholderText(/rechercher une adresse/i);
    await user.type(search, "10 rue de Rivoli");
    expect(search).toHaveValue("10 rue de Rivoli");
  });
});
