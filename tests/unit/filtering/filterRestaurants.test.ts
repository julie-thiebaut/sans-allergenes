import { describe, expect, it } from "vitest";
import { DEFAULT_FILTER_STATE, filterRestaurants } from "../../../src/filtering/filterRestaurants";
import type { RestaurantWithMenu } from "../../../src/data/types";
import { fullInfoMenu, makeAllergenMap, menuWithDrinks } from "../../fixtures/menu.fixture";
import {
  allFixtureRestaurants,
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
  restaurantWithUnknownInfo,
} from "../../fixtures/restaurants.fixture";

describe("filterRestaurants", () => {
  it("returns everything with default filters", () => {
    expect(filterRestaurants(allFixtureRestaurants, DEFAULT_FILTER_STATE)).toHaveLength(3);
  });

  it("filters by allergenInfoAvailableOnly", () => {
    const result = filterRestaurants(allFixtureRestaurants, {
      ...DEFAULT_FILTER_STATE,
      allergenInfoAvailableOnly: true,
    });
    expect(result).not.toContainEqual(restaurantWithoutAllergenInfo);
  });

  it("filters by cuisine type", () => {
    const result = filterRestaurants(allFixtureRestaurants, {
      ...DEFAULT_FILTER_STATE,
      cuisineTypes: ["Fusion"],
    });
    expect(result).toEqual([restaurantWithUnknownInfo]);
  });

  it("keeps a restaurant that still has a dish without the avoided allergen", () => {
    // fullInfoMenu: "Plat au blé" declares gluten, "Salade simple" doesn't. One offending dish
    // must not remove an establishment where something else is still on the table.
    const result = filterRestaurants(allFixtureRestaurants, {
      ...DEFAULT_FILTER_STATE,
      allergensToAvoid: ["gluten"],
    });
    expect(result).toContainEqual(restaurantWithFullInfo);
  });

  it("excludes a restaurant only when every dish declares the avoided allergen", () => {
    const allGluten: RestaurantWithMenu = {
      ...restaurantWithFullInfo,
      id: "rest-all-gluten",
      slug: "rest-all-gluten",
      menu: {
        ...fullInfoMenu,
        categories: [
          {
            category: "Plats",
            dishes: fullInfoMenu.categories[0]!.dishes.map((dish) => ({
              ...dish,
              allergens: makeAllergenMap({ gluten: "present" }),
            })),
          },
        ],
      },
    };

    const result = filterRestaurants([allGluten], {
      ...DEFAULT_FILTER_STATE,
      allergensToAvoid: ["gluten"],
    });
    expect(result).toEqual([]);
  });

  it("excludes a restaurant whose every dish declares the allergen, even if a drink doesn't", () => {
    // The coffee-shop case: every pastry declares gluten, only the coffee is left.
    const allGlutenButWater: RestaurantWithMenu = {
      ...restaurantWithFullInfo,
      id: "rest-all-gluten-but-water",
      slug: "rest-all-gluten-but-water",
      menu: {
        ...menuWithDrinks,
        categories: menuWithDrinks.categories.map((category) =>
          category.category === "Plats"
            ? {
                ...category,
                dishes: category.dishes.map((dish) => ({
                  ...dish,
                  allergens: makeAllergenMap({ gluten: "present" }),
                })),
              }
            : category,
        ),
      },
    };

    const result = filterRestaurants([allGlutenButWater], {
      ...DEFAULT_FILTER_STATE,
      allergensToAvoid: ["gluten"],
    });
    expect(result).toEqual([]);
  });

  it("excludes a restaurant whose dishes all declare the allergen or traces, once traces are excluded", () => {
    // fullInfoMenu with milk: "Plat au blé" declares traces, "Salade simple" nothing.
    const tracesOrMilk: RestaurantWithMenu = {
      ...restaurantWithFullInfo,
      id: "rest-traces-or-milk",
      slug: "rest-traces-or-milk",
      menu: {
        ...fullInfoMenu,
        categories: [
          {
            category: "Plats",
            dishes: [
              fullInfoMenu.categories[0]!.dishes[0]!,
              {
                ...fullInfoMenu.categories[0]!.dishes[1]!,
                allergens: makeAllergenMap({ lait: "present" }),
              },
            ],
          },
        ],
      },
    };
    const avoidMilk = { ...DEFAULT_FILTER_STATE, allergensToAvoid: ["lait" as const] };

    expect(filterRestaurants([tracesOrMilk], avoidMilk)).toEqual([tracesOrMilk]);
    expect(filterRestaurants([tracesOrMilk], { ...avoidMilk, excludeTraces: true })).toEqual([]);
  });

  it("judges a menu made only of drinks on its drinks", () => {
    const drinksOnly: RestaurantWithMenu = {
      ...restaurantWithFullInfo,
      id: "rest-drinks-only",
      slug: "rest-drinks-only",
      menu: {
        ...menuWithDrinks,
        categories: menuWithDrinks.categories.filter((category) => category.category === "Bières"),
      },
    };

    const result = filterRestaurants([drinksOnly], {
      ...DEFAULT_FILTER_STATE,
      allergensToAvoid: ["gluten"],
    });
    expect(result).toEqual([drinksOnly]);
  });

  it("keeps a restaurant with only unknown info for the avoided allergen (never silently marked safe)", () => {
    const result = filterRestaurants(allFixtureRestaurants, {
      ...DEFAULT_FILTER_STATE,
      allergensToAvoid: ["gluten"],
    });
    expect(result).toContainEqual(restaurantWithUnknownInfo);
  });

  it("keeps a restaurant with no menu data at all when avoiding an allergen", () => {
    const result = filterRestaurants(allFixtureRestaurants, {
      ...DEFAULT_FILTER_STATE,
      allergensToAvoid: ["gluten"],
    });
    expect(result).toContainEqual(restaurantWithoutAllergenInfo);
  });
});
