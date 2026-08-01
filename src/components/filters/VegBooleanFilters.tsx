import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function VegBooleanFilters() {
  const { vegetarianOnly, veganOnly } = useFilterState();
  const dispatch = useFilterDispatch();

  return (
    <div className="flex flex-wrap gap-4">
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={vegetarianOnly}
          onChange={(event) =>
            dispatch({ type: "SET_VEGETARIAN_ONLY", value: event.target.checked })
          }
        />
        Options végétariennes
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={veganOnly}
          onChange={(event) => dispatch({ type: "SET_VEGAN_ONLY", value: event.target.checked })}
        />
        Options véganes
      </label>
    </div>
  );
}
