import { AllergenInfoAvailableFilter } from "./AllergenInfoAvailableFilter";
import { AllergensToAvoidFilter } from "./AllergensToAvoidFilter";
import { ResetFiltersButton } from "./ResetFiltersButton";
import { VegBooleanFilters } from "./VegBooleanFilters";

export function SearchFilterBar() {
  return (
    <div className="space-y-3 border-b border-neutral-200 bg-white p-3">
      <VegBooleanFilters />
      <AllergenInfoAvailableFilter />
      <AllergensToAvoidFilter />
      <div className="flex justify-end">
        <ResetFiltersButton />
      </div>
    </div>
  );
}
