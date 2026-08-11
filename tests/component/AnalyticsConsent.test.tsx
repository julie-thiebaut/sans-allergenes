import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AnalyticsConsentBanner } from "../../src/analytics/AnalyticsConsent";
import { AnalyticsConsentContext } from "../../src/analytics/analyticsConsentContext";
import { Footer } from "../../src/components/layout/Footer";

describe("Analytics consent banner", () => {
  it("offers equally direct accept and refuse actions before loading Analytics", async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    const onRefuse = vi.fn();

    render(
      <MemoryRouter>
        <AnalyticsConsentBanner
          open
          hasExistingChoice={false}
          onAccept={onAccept}
          onRefuse={onRefuse}
          onClose={() => {}}
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Accepter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refuser" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /fermer/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /en savoir plus/i })).toHaveAttribute(
      "href",
      "/confidentialite#cookies",
    );

    await user.click(screen.getByRole("button", { name: "Refuser" }));
    expect(onRefuse).toHaveBeenCalledOnce();
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("can be closed after a previous choice", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <AnalyticsConsentBanner
          open
          hasExistingChoice
          onAccept={() => {}}
          onRefuse={() => {}}
          onClose={onClose}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /fermer les réglages/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("keeps the cookie settings available from the footer", async () => {
    const user = userEvent.setup();
    const openSettings = vi.fn();

    render(
      <MemoryRouter>
        <AnalyticsConsentContext.Provider
          value={{ isAvailable: true, choice: "accepted", openSettings }}
        >
          <Footer />
        </AnalyticsConsentContext.Provider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /gérer les cookies/i }));
    expect(openSettings).toHaveBeenCalledOnce();
  });
});
