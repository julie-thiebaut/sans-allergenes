import { AllergenInfoAvailableFilter } from "./AllergenInfoAvailableFilter";
import { AllergensToAvoidFilter } from "./AllergensToAvoidFilter";
import { ResetFiltersButton } from "./ResetFiltersButton";
import { VegBooleanFilters } from "./VegBooleanFilters";

export function SearchFilterBar() {
  return (
    <div className="space-y-3 border-b border-neutral-200 bg-white p-3">
      <div className="flex flex-col gap-3 md:flex-row md:flex-nowrap md:items-center md:gap-4">
        <VegBooleanFilters />
        <AllergenInfoAvailableFilter />
      </div>
      <AllergensToAvoidFilter />
      <div className="flex justify-end">
        <ResetFiltersButton />
      </div>
    </div>
  );
}
