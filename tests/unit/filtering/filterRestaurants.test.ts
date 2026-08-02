import { describe, expect, it } from "vitest";
import { DEFAULT_FILTER_STATE, filterRestaurants } from "../../../src/filtering/filterRestaurants";
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

  it("excludes a restaurant with a confirmed present match for an avoided allergen", () => {
    const result = filterRestaurants(allFixtureRestaurants, {
      ...DEFAULT_FILTER_STATE,
      allergensToAvoid: ["gluten"],
    });
    expect(result).not.toContainEqual(restaurantWithFullInfo);
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
