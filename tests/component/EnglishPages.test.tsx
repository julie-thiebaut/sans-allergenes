import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataContext } from "../../src/data/DataProvider";
import { ContentTranslationsProvider } from "../../src/i18n/ContentTranslations";
import { LandingPage } from "../../src/routes/LandingPage";
import { RestaurantDetailPage } from "../../src/routes/RestaurantDetailPage";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { allFixtureRestaurants, restaurantWithFullInfo } from "../fixtures/restaurants.fixture";

const NOTICE_FR =
  "Les informations allergènes publiées par Test ne couvrent pas l'élément suivant : le dessert. Il n'est donc pas repris sur ce site.";
const NOTICE_EN =
  "The allergen information published by Test does not cover the following item: the dessert. It is therefore not included on this site.";
const STALE_NOTICE_FR = "Un bandeau modifié depuis sa traduction.";

function stubTranslations(table: Record<string, string>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(table), { status: 200 })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderAt(path: string, restaurants = allFixtureRestaurants) {
  return render(
    <DataContext.Provider value={{ status: "ready", restaurants }}>
      <FilterStateProvider>
        <MemoryRouter initialEntries={[path]}>
          <ContentTranslationsProvider>
            <Routes>
              <Route path="/en/" element={<LandingPage />} />
              <Route path="/en/restaurant/:slug" element={<RestaurantDetailPage />} />
              <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
            </Routes>
          </ContentTranslationsProvider>
        </MemoryRouter>
      </FilterStateProvider>
    </DataContext.Provider>,
  );
}

describe("English restaurant page", () => {
  it("speaks English around a menu quoted in French", async () => {
    stubTranslations({});
    renderAt("/en/restaurant/le-restaurant-complet");

    expect(screen.getByText(/for guidance only/i)).toBeInTheDocument();
    expect(
      screen.getByText(/shown in French, exactly as the restaurant publishes them/i),
    ).toBeInTheDocument();
    // The dish keeps its published name, marked as French for screen readers.
    expect(screen.getByText("Plat au blé")).toHaveAttribute("lang", "fr");
    expect(screen.getByRole("link", { name: /back to the map/i })).toHaveAttribute(
      "href",
      "/en/map/",
    );
    expect(screen.getByRole("link", { name: "Lire cette page en français" })).toHaveAttribute(
      "href",
      "/restaurant/le-restaurant-complet/",
    );
  });

  it("translates a coverage notice whose French text matches, and keeps one that does not in French", async () => {
    stubTranslations({ [NOTICE_FR]: NOTICE_EN });
    renderAt("/en/restaurant/le-restaurant-complet", [
      { ...restaurantWithFullInfo, allergenCoverageNotice: NOTICE_FR },
    ]);
    expect(await screen.findByText(NOTICE_EN)).toBeInTheDocument();

    stubTranslations({ [NOTICE_FR]: NOTICE_EN });
    renderAt("/en/restaurant/le-restaurant-complet", [
      { ...restaurantWithFullInfo, allergenCoverageNotice: STALE_NOTICE_FR },
    ]);
    const stale = await screen.findByText(STALE_NOTICE_FR);
    expect(stale).toHaveAttribute("lang", "fr");
  });

  it("filters with English allergen names", async () => {
    stubTranslations({});
    renderAt("/en/restaurant/le-restaurant-complet");
    // jsdom has no desktop width: the filter sits behind its mobile button.
    await userEvent.click(screen.getByRole("button", { name: "Filter by allergens" }));
    await userEvent.click(screen.getByRole("checkbox", { name: /gluten/i }));
    expect(screen.getByText(/1 dish hidden/i)).toBeInTheDocument();
  });

  it("stays in French at the French address, without loading any translation", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    renderAt("/restaurant/le-restaurant-complet");
    expect(screen.getByText(/informations présentées sont indicatives/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read this page in English" })).toHaveAttribute(
      "href",
      "/en/restaurant/le-restaurant-complet/",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe("English landing page", () => {
  it("keeps the warning to tell staff, and links to the English map", () => {
    stubTranslations({});
    renderAt("/en/");
    expect(
      screen.getByRole("heading", { name: /always tell staff about your allergy/i }),
    ).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: "Explore the map" })) {
      expect(link).toHaveAttribute("href", "/en/map/");
    }
  });
});
