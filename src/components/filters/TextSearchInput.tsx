import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function TextSearchInput() {
  const { searchText } = useFilterState();
  const dispatch = useFilterDispatch();

  return (
    <div>
      <label htmlFor="restaurant-search" className="sr-only">
        Rechercher par nom, adresse ou type de cuisine
      </label>
      <input
        id="restaurant-search"
        type="search"
        value={searchText}
        onChange={(event) => dispatch({ type: "SET_SEARCH_TEXT", value: event.target.value })}
        placeholder="Rechercher par nom, adresse ou cuisine…"
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
      />
    </div>
  );
}
