import type { AllergenId, RestaurantWithMenu } from "../data/types";
import { countDishesDeclaringAvoided } from "./allergenLogic";

export interface FilterState {
  cuisineTypes: string[];
  vegetarianOnly: boolean;
  veganOnly: boolean;
  allergenInfoAvailableOnly: boolean;
  allergensToAvoid: AllergenId[];
}

export const DEFAULT_FILTER_STATE: FilterState = {
  cuisineTypes: [],
  vegetarianOnly: false,
  veganOnly: false,
  allergenInfoAvailableOnly: false,
  allergensToAvoid: [],
};

export function isFilterStateDefault(filters: FilterState): boolean {
  return (
    filters.cuisineTypes.length === 0 &&
    !filters.vegetarianOnly &&
    !filters.veganOnly &&
    !filters.allergenInfoAvailableOnly &&
    filters.allergensToAvoid.length === 0
  );
}

/**
 * Pure, client-side filter. A restaurant is removed for an avoided allergen only when EVERY
 * dish on its menu declares that allergen present — one offending dish out of ten is not a
 * reason to hide an establishment where the other nine are still an option, and hiding it
 * would also contradict the menu view, which happily lists those nine.
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
      const { declaring, total } = countDishesDeclaringAvoided(
        restaurant.menu,
        filters.allergensToAvoid,
      );
      // total === 0 means there is no menu to judge — kept, flagged as incomplete elsewhere.
      if (total > 0 && declaring === total) return false;
    }

    return true;
  });
}
