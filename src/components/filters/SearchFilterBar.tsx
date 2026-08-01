import { useMemo } from "react";
import type { RestaurantWithMenu } from "../../data/types";
import { AllergenInfoAvailableFilter } from "./AllergenInfoAvailableFilter";
import { AllergensToAvoidFilter } from "./AllergensToAvoidFilter";
import { CuisineFilter } from "./CuisineFilter";
import { ResetFiltersButton } from "./ResetFiltersButton";
import { TextSearchInput } from "./TextSearchInput";
import { VegBooleanFilters } from "./VegBooleanFilters";

export function SearchFilterBar({ allRestaurants }: { allRestaurants: RestaurantWithMenu[] }) {
  const cuisineOptions = useMemo(
    () =>
      [...new Set(allRestaurants.flatMap((restaurant) => restaurant.cuisineTypes))].sort((a, b) =>
        a.localeCompare(b, "fr"),
      ),
    [allRestaurants],
  );

  return (
    <div className="space-y-3 border-b border-neutral-200 bg-white p-3">
      <TextSearchInput />
      <CuisineFilter options={cuisineOptions} />
      <VegBooleanFilters />
      <AllergenInfoAvailableFilter />
      <AllergensToAvoidFilter />
      <div className="flex justify-end">
        <ResetFiltersButton />
      </div>
    </div>
  );
}
