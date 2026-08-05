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
    expect(screen.getByText(/la loi impose aux restaurants/i)).toBeInTheDocument();

    const mapLinks = screen.getAllByRole("link", { name: /explorer la carte/i });
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

    // Affirmative safety claims are the thing to forbid, in whatever wording the copy lands on.
    expect(screen.queryByText(/\bsafe\b|sans risque|sûr pour|adapté à votre allergie/i)).toBeNull();

    expect(
      screen.getByRole("heading", { name: /signalez toujours votre allergie/i }),
    ).toBeInTheDocument();
    // Two things this block must always do, however it is reworded: attribute the data to the
    // restaurants rather than to the site, and say it can go out of date.
    expect(screen.getByText(/allergènes déclarés par\s+les restaurants/i)).toBeInTheDocument();
    expect(screen.getByText(/peuvent toutefois évoluer/i)).toBeInTheDocument();
  });

  it("tells the reader to check with staff, which no page copy may replace", () => {
    renderLanding();
    expect(
      screen.getByText(/informez toujours le personnel de votre allergie/i),
    ).toBeInTheDocument();
    // Cross-contamination is the failure mode a declaration cannot cover, so the warning has to
    // name it rather than leaving the reader to infer it.
    expect(screen.getByText(/contamination croisée/i)).toBeInTheDocument();
  });
});
