import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import type { AllergenId } from "../data/types";
import { DEFAULT_FILTER_STATE, type FilterState } from "../filtering/filterRestaurants";

export type FilterAction =
  | { type: "SET_CUISINE_TYPES"; value: string[] }
  | { type: "SET_VEGETARIAN_ONLY"; value: boolean }
  | { type: "SET_VEGAN_ONLY"; value: boolean }
  | { type: "SET_ALLERGEN_INFO_AVAILABLE_ONLY"; value: boolean }
  | { type: "SET_ALLERGENS_TO_AVOID"; value: AllergenId[] }
  | { type: "RESET" }
  | { type: "REPLACE_ALL"; value: FilterState };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_CUISINE_TYPES":
      return { ...state, cuisineTypes: action.value };
    case "SET_VEGETARIAN_ONLY":
      return { ...state, vegetarianOnly: action.value };
    case "SET_VEGAN_ONLY":
      return { ...state, veganOnly: action.value };
    case "SET_ALLERGEN_INFO_AVAILABLE_ONLY":
      return { ...state, allergenInfoAvailableOnly: action.value };
    case "SET_ALLERGENS_TO_AVOID":
      return { ...state, allergensToAvoid: action.value };
    case "RESET":
      return DEFAULT_FILTER_STATE;
    case "REPLACE_ALL":
      return action.value;
    default:
      return state;
  }
}

const FilterStateContext = createContext<FilterState | null>(null);
const FilterDispatchContext = createContext<Dispatch<FilterAction> | null>(null);

export function FilterStateProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: FilterState;
}) {
  const [state, dispatch] = useReducer(filterReducer, initialState ?? DEFAULT_FILTER_STATE);
  return (
    <FilterStateContext.Provider value={state}>
      <FilterDispatchContext.Provider value={dispatch}>{children}</FilterDispatchContext.Provider>
    </FilterStateContext.Provider>
  );
}

export function useFilterState(): FilterState {
  const context = useContext(FilterStateContext);
  if (!context) {
    throw new Error("useFilterState must be used within a FilterStateProvider");
  }
  return context;
}

export function useFilterDispatch(): Dispatch<FilterAction> {
  const context = useContext(FilterDispatchContext);
  if (!context) {
    throw new Error("useFilterDispatch must be used within a FilterStateProvider");
  }
  return context;
}
