import { describe, expect, it } from "vitest";
import { mapBoundsToRestaurantIds } from "../../../src/components/map/mapBoundsToRestaurantIds";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../../fixtures/restaurants.fixture";

const PARIS_BOUNDS = { north: 48.87, south: 48.85, east: 2.36, west: 2.34 };

describe("mapBoundsToRestaurantIds", () => {
  it("includes restaurants located within the given bounds", () => {
    const ids = mapBoundsToRestaurantIds(PARIS_BOUNDS, [
      restaurantWithFullInfo,
      restaurantWithoutAllergenInfo,
    ]);
    expect(ids.has(restaurantWithFullInfo.id)).toBe(true);
    expect(ids.has(restaurantWithoutAllergenInfo.id)).toBe(true);
  });

  it("excludes a restaurant clearly outside the bounds", () => {
    const farRestaurant = { ...restaurantWithFullInfo, id: "far-away", latitude: 45, longitude: 5 };
    const ids = mapBoundsToRestaurantIds(PARIS_BOUNDS, [farRestaurant]);
    expect(ids.has("far-away")).toBe(false);
  });
});
