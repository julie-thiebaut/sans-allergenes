import { describe, expect, it } from "vitest";
import { buildMapMeta, buildRestaurantMeta } from "../../../src/seo/seoData";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../../fixtures/restaurants.fixture";

const SITE_URL = "https://sans-allergenes.fr/";
const catalog = [restaurantWithFullInfo, restaurantWithoutAllergenInfo];

describe("buildRestaurantMeta", () => {
  it("titles a record with allergens after its menu", () => {
    expect(buildRestaurantMeta(restaurantWithFullInfo, SITE_URL, catalog).title).toBe(
      "Le Restaurant Complet : allergènes de la carte (Paris)",
    );
  });

  it("says in the title when the allergens are not published", () => {
    expect(buildRestaurantMeta(restaurantWithoutAllergenInfo, SITE_URL, catalog).title).toBe(
      "Le Bistrot Sans Info (Paris) : allergènes non publiés",
    );
  });

  it("never puts the site's name next to a restaurant's", () => {
    for (const restaurant of catalog) {
      expect(buildRestaurantMeta(restaurant, SITE_URL, catalog).title).not.toContain(
        "Sans Allergènes",
      );
    }
  });

  it("tells the addresses of a chain apart by their street", () => {
    const otherAddress = {
      ...restaurantWithFullInfo,
      id: "rest-full-info-2",
      name: "le restaurant complet ",
      address: "5 rue de Test",
    };
    const chain = [restaurantWithFullInfo, otherAddress];

    expect(buildRestaurantMeta(restaurantWithFullInfo, SITE_URL, chain).title).toBe(
      "Le Restaurant Complet, 1 rue de Test : allergènes de la carte",
    );
    expect(buildRestaurantMeta(otherAddress, SITE_URL, chain).title).toContain("5 rue de Test");
  });

  it("describes the restaurant by its own site, and this page as its description", () => {
    const { jsonLd } = buildRestaurantMeta(
      { ...restaurantWithFullInfo, websiteUrl: "https://example.com/", phone: "01 23 45 67 89" },
      SITE_URL,
      catalog,
    );

    expect(jsonLd).toMatchObject({
      url: "https://example.com/",
      telephone: "01 23 45 67 89",
      mainEntityOfPage: "https://sans-allergenes.fr/restaurant/le-restaurant-complet/",
    });
  });

  it("leaves out the site and the phone when the record has neither", () => {
    const { jsonLd } = buildRestaurantMeta(restaurantWithoutAllergenInfo, SITE_URL, catalog);

    expect(jsonLd).not.toHaveProperty("url");
    expect(jsonLd).not.toHaveProperty("telephone");
  });
});

describe("share image", () => {
  it("is an absolute URL, which is all a site reading the tag can resolve", () => {
    expect(buildMapMeta(SITE_URL).ogImage).toBe("https://sans-allergenes.fr/og-image.png");
    expect(buildRestaurantMeta(restaurantWithFullInfo, SITE_URL, catalog).ogImage).toBe(
      "https://sans-allergenes.fr/og-image.png",
    );
  });
});
