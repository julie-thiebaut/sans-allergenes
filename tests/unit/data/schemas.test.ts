import { describe, expect, it } from "vitest";
import {
  AllergenMapSchema,
  ConfigSchema,
  MenuSchema,
  RestaurantListSchema,
  RestaurantSchema,
} from "../../../src/data/schemas";
import { fullInfoMenu, makeAllergenMap } from "../../fixtures/menu.fixture";
import { restaurantWithFullInfo } from "../../fixtures/restaurants.fixture";

// z.object() strips unrecognized keys rather than rejecting them, so passing the fixture's
// `menu` field (not part of RestaurantSchema) straight through is fine here.
function rawRestaurant() {
  return restaurantWithFullInfo;
}

describe("RestaurantSchema", () => {
  it("accepts a valid restaurant", () => {
    expect(RestaurantSchema.safeParse(rawRestaurant()).success).toBe(true);
  });

  it("rejects an invalid postal code", () => {
    const result = RestaurantSchema.safeParse({ ...rawRestaurant(), postalCode: "abc" });
    expect(result.success).toBe(false);
  });

  it("rejects an out-of-range price level", () => {
    const result = RestaurantSchema.safeParse({ ...rawRestaurant(), priceLevel: 7 });
    expect(result.success).toBe(false);
  });
});

describe("RestaurantListSchema", () => {
  it("rejects duplicate ids", () => {
    const restaurant = rawRestaurant();
    const result = RestaurantListSchema.safeParse([
      restaurant,
      { ...restaurant, slug: "other-slug" },
    ]);
    expect(result.success).toBe(false);
  });

  it("rejects duplicate slugs", () => {
    const restaurant = rawRestaurant();
    const result = RestaurantListSchema.safeParse([restaurant, { ...restaurant, id: "other-id" }]);
    expect(result.success).toBe(false);
  });
});

describe("MenuSchema", () => {
  it("accepts a valid menu", () => {
    expect(MenuSchema.safeParse(fullInfoMenu).success).toBe(true);
  });

  it("rejects a dish missing an allergen key", () => {
    const incompleteMap = makeAllergenMap();
    delete (incompleteMap as Partial<typeof incompleteMap>).gluten;

    const badMenu = {
      ...fullInfoMenu,
      categories: [
        {
          category: "Plats",
          dishes: [{ id: "bad-dish", name: "Plat incomplet", price: 5, allergens: incompleteMap }],
        },
      ],
    };
    expect(MenuSchema.safeParse(badMenu).success).toBe(false);
  });
});

describe("AllergenMapSchema", () => {
  it("rejects an unrecognized allergen key", () => {
    const map = { ...makeAllergenMap(), notARealAllergen: "present" };
    expect(AllergenMapSchema.safeParse(map).success).toBe(false);
  });

  it("rejects an invalid status value", () => {
    const map = { ...makeAllergenMap(), gluten: "definitely_safe" };
    expect(AllergenMapSchema.safeParse(map).success).toBe(false);
  });
});

describe("ConfigSchema", () => {
  it("accepts a boolean googleMapsEnabled", () => {
    expect(ConfigSchema.safeParse({ googleMapsEnabled: true }).success).toBe(true);
  });

  it("rejects a non-boolean googleMapsEnabled", () => {
    expect(ConfigSchema.safeParse({ googleMapsEnabled: "yes" }).success).toBe(false);
  });
});
