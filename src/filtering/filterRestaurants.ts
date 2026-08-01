import type { AllergenId, RestaurantWithMenu } from "../data/types";
import { assessMenuAgainstAvoidance } from "./allergenLogic";
import { matchesSearchText } from "./searchText";

export interface FilterState {
  searchText: string;
  cuisineTypes: string[];
  vegetarianOnly: boolean;
  veganOnly: boolean;
  allergenInfoAvailableOnly: boolean;
  allergensToAvoid: AllergenId[];
}

export const DEFAULT_FILTER_STATE: FilterState = {
  searchText: "",
  cuisineTypes: [],
  vegetarianOnly: false,
  veganOnly: false,
  allergenInfoAvailableOnly: false,
  allergensToAvoid: [],
};

export function isFilterStateDefault(filters: FilterState): boolean {
  return (
    filters.searchText.trim() === "" &&
    filters.cuisineTypes.length === 0 &&
    !filters.vegetarianOnly &&
    !filters.veganOnly &&
    !filters.allergenInfoAvailableOnly &&
    filters.allergensToAvoid.length === 0
  );
}

/**
 * Pure, client-side filter. The allergens-to-avoid filter only ever removes a restaurant on
 * a CONFIRMED "present" match (see allergenLogic.ts) — restaurants with only "may_contain" or
 * incomplete info stay in the results, distinguishable via a badge, never silently promoted
 * to "safe".
 */
export function filterRestaurants(
  restaurants: RestaurantWithMenu[],
  filters: FilterState,
): RestaurantWithMenu[] {
  return restaurants.filter((restaurant) => {
    if (!matchesSearchText(restaurant, filters.searchText)) return false;

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
      const assessment = assessMenuAgainstAvoidance(restaurant.menu, filters.allergensToAvoid);
      if (assessment === "contains_avoided") return false;
    }

    return true;
  });
}
