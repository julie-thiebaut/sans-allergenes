import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { AllergenIdSchema } from "../data/schemas";
import type { AllergenId } from "../data/types";
import type { FilterState } from "../filtering/filterRestaurants";
import { useFilterDispatch, useFilterState } from "./FilterStateContext";

const PARAM_KEYS = {
  cuisineTypes: "cuisine",
  vegetarianOnly: "veg",
  veganOnly: "vegan",
  allergenInfoAvailableOnly: "hasAllergenInfo",
  allergensToAvoid: "avoid",
} as const;

function parseFilterStateFromParams(params: URLSearchParams): FilterState {
  const allergensToAvoid = (params.get(PARAM_KEYS.allergensToAvoid) ?? "")
    .split(",")
    .filter(Boolean)
    .filter((id): id is AllergenId => AllergenIdSchema.safeParse(id).success);

  return {
    cuisineTypes: (params.get(PARAM_KEYS.cuisineTypes) ?? "").split(",").filter(Boolean),
    vegetarianOnly: params.get(PARAM_KEYS.vegetarianOnly) === "1",
    veganOnly: params.get(PARAM_KEYS.veganOnly) === "1",
    allergenInfoAvailableOnly: params.get(PARAM_KEYS.allergenInfoAvailableOnly) === "1",
    allergensToAvoid,
  };
}

function filterStateToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.cuisineTypes.length > 0)
    params.set(PARAM_KEYS.cuisineTypes, filters.cuisineTypes.join(","));
  if (filters.vegetarianOnly) params.set(PARAM_KEYS.vegetarianOnly, "1");
  if (filters.veganOnly) params.set(PARAM_KEYS.veganOnly, "1");
  if (filters.allergenInfoAvailableOnly) params.set(PARAM_KEYS.allergenInfoAvailableOnly, "1");
  if (filters.allergensToAvoid.length > 0) {
    params.set(PARAM_KEYS.allergensToAvoid, filters.allergensToAvoid.join(","));
  }
  return params;
}

/**
 * Mirrors FilterState to/from the URL query string so filtered views are shareable.
 * This never affects the canonical `/` route that gets prerendered/indexed — query params
 * are purely client-side filter state, not separate crawlable pages.
 */
export function useUrlFilterSync(): void {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useFilterDispatch();
  const filters = useFilterState();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;
    dispatch({ type: "REPLACE_ALL", value: parseFilterStateFromParams(searchParams) });
    // Intentionally run once on mount only — this hydrates from the URL a page was opened with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    setSearchParams(filterStateToParams(filters), { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
}
