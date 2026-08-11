import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Footer } from "../../src/components/layout/Footer";
import { LegalNoticePage } from "../../src/routes/LegalNoticePage";
import { PrivacyPage } from "../../src/routes/PrivacyPage";

describe("Legal and privacy pages", () => {
  it("exposes both legal pages and the contact address from the footer", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /mentions légales et cgu/i })).toHaveAttribute(
      "href",
      "/mentions-legales",
    );
    expect(screen.getByRole("link", { name: /confidentialité et cookies/i })).toHaveAttribute(
      "href",
      "/confidentialite",
    );
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
      "href",
      "mailto:contact@sans-allergenes.fr",
    );
  });

  it("identifies the publisher and keeps the allergen safety warning prominent", () => {
    render(
      <MemoryRouter>
        <LegalNoticePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /mentions légales et conditions d’utilisation/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/édité à titre non professionnel par/i)).toHaveTextContent(
      /Julie Thiebaut/i,
    );
    expect(
      screen.getByText(/le site ne constitue pas une garantie de sécurité/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /politique de confidentialité et cookies/i }),
    ).toHaveAttribute("href", "/confidentialite");
  });

  it("explains Analytics, Google Maps and Places, URL filters, retention and data rights", () => {
    render(
      <MemoryRouter>
        <PrivacyPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /confidentialité et cookies/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/google maps platform/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/google analytics/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/places api \(new\)/i)).toBeInTheDocument();
    expect(screen.getByText(/inscrits dans l’url/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum douze mois/i)).toBeInTheDocument();
    expect(screen.getAllByText(/treize mois au maximum/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /commission nationale/i })).toBeInTheDocument();
  });
});
