import { AllergenInfoAvailableFilter } from "./AllergenInfoAvailableFilter";
import { AllergensToAvoidFilter } from "./AllergensToAvoidFilter";
import { DietFilters } from "./DietFilters";
import { ExcludeTracesFilter } from "./ExcludeTracesFilter";
import { ResetFiltersButton } from "./ResetFiltersButton";

export function SearchFilterBar() {
  return (
    <div className="space-y-3 border-b border-neutral-200 bg-white p-3">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-4 lg:flex-nowrap">
        <DietFilters />
        <AllergenInfoAvailableFilter />
        <ExcludeTracesFilter />
      </div>
      <AllergensToAvoidFilter />
      <div className="flex justify-end">
        <ResetFiltersButton />
      </div>
    </div>
  );
}
