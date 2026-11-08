import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Footer } from "../../src/components/layout/Footer";
import { AllergensOnlineNotePage } from "../../src/routes/AllergensOnlineNotePage";

function renderNote() {
  render(
    <MemoryRouter>
      <AllergensOnlineNotePage />
    </MemoryRouter>,
  );
}

describe("Allergens online article", () => {
  it("is reachable from the footer", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /^notes$/i })).toHaveAttribute(
      "href",
      "/notes/allergenes-en-ligne/",
    );
  });

  it("links every text and survey it cites to its official page", () => {
    renderNote();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/ce que dit la loi/i);
    const sources = screen.getByRole("heading", { name: /sources officielles/i }).parentElement!;
    const hrefs = Array.from(sources.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual([
      expect.stringContaining("eur-lex.europa.eu"),
      expect.stringContaining("legifrance.gouv.fr/jorf/"),
      expect.stringContaining("legifrance.gouv.fr/codes/"),
      expect.stringContaining("economie.gouv.fr/dgccrf"),
      expect.stringContaining("economie.gouv.fr/dgccrf"),
      expect.stringContaining("signal.conso.gouv.fr"),
    ]);
  });

  it("says an absence online is not a breach, and keeps the reader talking to staff", () => {
    renderNote();
    expect(
      screen.getByText(/ne signifie donc pas que le restaurant\s+ne respecte pas/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/toujours signaler\s+son allergie au personnel/i)).toBeInTheDocument();
  });

  it("leads to the map, and names the filter to uncheck as the map labels it", () => {
    renderNote();
    expect(screen.getByRole("link", { name: /carte de sans allergènes/i })).toHaveAttribute(
      "href",
      "/carte/",
    );
    expect(
      screen.getByText(/décochez le filtre «\s*informations allergènes disponibles\s+uniquement/i),
    ).toBeInTheDocument();
  });
});
