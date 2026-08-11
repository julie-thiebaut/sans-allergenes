import { describe, expect, it } from "vitest";
import {
  mapBoundsCenter,
  sortRestaurantsByDistance,
} from "../../../src/components/map/sortRestaurantsByDistance";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../../fixtures/restaurants.fixture";

describe("mapBoundsCenter", () => {
  it("returns the midpoint of regular map bounds", () => {
    expect(mapBoundsCenter({ north: 49, south: 48, east: 3, west: 2 })).toEqual({
      lat: 48.5,
      lng: 2.5,
    });
  });

  it("handles bounds that cross the antimeridian", () => {
    expect(mapBoundsCenter({ north: 10, south: -10, east: -170, west: 170 })).toEqual({
      lat: 0,
      lng: -180,
    });
  });
});

describe("sortRestaurantsByDistance", () => {
  it("puts the restaurants closest to the requested centre first without mutating the input", () => {
    const near = {
      ...restaurantWithFullInfo,
      id: "near",
      latitude: 48.8567,
      longitude: 2.3523,
    };
    const far = {
      ...restaurantWithoutAllergenInfo,
      id: "far",
      latitude: 48.9,
      longitude: 2.4,
    };
    const input = [far, near];

    const sorted = sortRestaurantsByDistance(input, { lat: 48.8566, lng: 2.3522 });

    expect(sorted.map((restaurant) => restaurant.id)).toEqual(["near", "far"]);
    expect(input.map((restaurant) => restaurant.id)).toEqual(["far", "near"]);
  });

  it("keeps the original order when two restaurants are equally distant", () => {
    const first = {
      ...restaurantWithFullInfo,
      id: "first",
      latitude: 48.8566,
      longitude: 2.3522,
    };
    const second = { ...first, id: "second" };

    const sorted = sortRestaurantsByDistance([second, first], {
      lat: 48.8566,
      lng: 2.3522,
    });

    expect(sorted.map((restaurant) => restaurant.id)).toEqual(["second", "first"]);
  });
});
