import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function TextSearchInput() {
  const { searchText } = useFilterState();
  const dispatch = useFilterDispatch();

  return (
    <div className="relative">
      <label htmlFor="restaurant-search" className="sr-only">
        Rechercher par nom ou adresse
      </label>
      <input
        id="restaurant-search"
        type="search"
        value={searchText}
        onChange={(event) => dispatch({ type: "SET_SEARCH_TEXT", value: event.target.value })}
        placeholder="Rechercher par nom ou adresse…"
        className="w-full rounded-full border border-neutral-300 py-2 pl-4 pr-10 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
    </div>
  );
}
