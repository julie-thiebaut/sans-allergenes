import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LandingPage } from "../../src/routes/LandingPage";

function renderLanding() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/carte" element={<div>La carte</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LandingPage", () => {
  it("explains what the site does and points to the map", () => {
    renderLanding();
    // The headline is marketing copy and is expected to keep changing, so it is not asserted
    // word for word. What must hold is that the page states the premise somewhere and offers
    // a way through to the map.
    expect(screen.getByRole("heading", { level: 1 }).textContent?.trim()).toBeTruthy();
    expect(screen.getByText(/déclarer 14 allergènes/i)).toBeInTheDocument();

    const mapLinks = screen.getAllByRole("link", { name: /voir la carte/i });
    expect(mapLinks.length).toBeGreaterThan(0);
    mapLinks.forEach((link) => expect(link).toHaveAttribute("href", "/carte"));
  });

  it("renders without a map, so it must not require the maps providers", () => {
    // The address search box depends on MapActionsProvider; rendering here at all proves the
    // landing page doesn't drag the map machinery in.
    expect(() => renderLanding()).not.toThrow();
    expect(screen.queryByPlaceholderText(/rechercher une adresse/i)).not.toBeInTheDocument();
  });

  it("never promises safety, and says missing information is not an absence", () => {
    renderLanding();

    // Affirmative safety claims are the thing to forbid. "garantir" is deliberately NOT in this
    // list: the page uses it in the negative ("ne peut pas garantir"), asserted just below.
    expect(screen.queryByText(/\bsafe\b|sans risque|sûr pour|adapté à votre allergie/i)).toBeNull();

    expect(
      screen.getByRole("heading", { name: /signalez toujours votre allergie/i }),
    ).toBeInTheDocument();
    // The declaration is a point-in-time snapshot, which is why the page never presents it as
    // the current state of the kitchen.
    expect(
      screen.getByText(/susceptible d.avoir été modifiée depuis la dernière déclaration/i),
    ).toBeInTheDocument();
  });

  it("tells the reader to check with staff, which no page copy may replace", () => {
    renderLanding();
    expect(
      screen.getByText(/prévenez toujours le personnel et confirmez avec lui/i),
    ).toBeInTheDocument();
  });
});
