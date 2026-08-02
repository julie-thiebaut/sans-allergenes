import { useFilterDispatch } from "../../state/FilterStateContext";

export function ResetFiltersButton() {
  const dispatch = useFilterDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "RESET" })}
      className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      Réinitialiser les filtres
    </button>
  );
}
