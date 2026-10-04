import type { AllergenId, RestaurantWithMenu } from "../data/types";
import { countDishesDeclaringAvoided } from "./allergenLogic";

export interface FilterState {
  cuisineTypes: string[];
  vegetarianOnly: boolean;
  veganOnly: boolean;
  allergenInfoAvailableOnly: boolean;
  allergensToAvoid: AllergenId[];
  /** Set aside the dishes declaring traces of an avoided allergen, as well as those declaring it. */
  excludeTraces: boolean;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  cuisineTypes: [],
  vegetarianOnly: false,
  veganOnly: false,
  allergenInfoAvailableOnly: false,
  allergensToAvoid: [],
  excludeTraces: false,
};

export function isFilterStateDefault(filters: FilterState): boolean {
  return (
    filters.cuisineTypes.length === 0 &&
    !filters.vegetarianOnly &&
    !filters.veganOnly &&
    !filters.allergenInfoAvailableOnly &&
    filters.allergensToAvoid.length === 0 &&
    !filters.excludeTraces
  );
}

/**
 * Pure, client-side filter. A restaurant is removed for an avoided allergen only when EVERY
 * dish on its menu declares that allergen present — one offending dish out of ten is not a
 * reason to hide an establishment where the other nine are still an option, and hiding it
 * would also contradict the menu view, which happily lists those nine. Drinks don't count: a
 * coffee shop whose every pastry declares gluten is removed, even though its coffee doesn't. A
 * menu that is ALL drinks is judged on its drinks. When the visitor excludes traces, a dish
 * declaring traces counts as declaring the allergen.
 *
 * Restaurants kept this way are never promoted to "safe": dishes with "may_contain" or missing
 * information stay listed and labelled, and the card says how many dishes are concerned.
 */
export function filterRestaurants(
  restaurants: RestaurantWithMenu[],
  filters: FilterState,
): RestaurantWithMenu[] {
  return restaurants.filter((restaurant) => {
    if (
      filters.cuisineTypes.length > 0 &&
      !restaurant.cuisineTypes.some((cuisine) => filters.cuisineTypes.includes(cuisine))
    ) {
      return false;
    }

    if (filters.vegetarianOnly && !restaurant.vegetarianOptions) return false;
    if (filters.veganOnly && !restaurant.veganOptions) return false;
    if (filters.allergenInfoAvailableOnly && !restaurant.allergenInformationAvailable) return false;

    if (filters.allergensToAvoid.length > 0) {
      const { dishes, drinks } = countDishesDeclaringAvoided(
        restaurant.menu,
        filters.allergensToAvoid,
        { excludeTraces: filters.excludeTraces },
      );
      const { declaring, total } = dishes.total > 0 ? dishes : drinks;
      // total === 0 means there is no menu to judge — kept, flagged as incomplete elsewhere.
      if (total > 0 && declaring === total) return false;
    }

    return true;
  });
}
