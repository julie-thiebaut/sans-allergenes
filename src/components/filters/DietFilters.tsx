import { useMessages } from "../../i18n/useLocale";
import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function DietFilters() {
  const { vegetarianOnly, veganOnly, meatOnly } = useFilterState();
  const dispatch = useFilterDispatch();
  const t = useMessages();

  return (
    <div className="flex flex-wrap gap-4 md:flex-nowrap">
      <label className="flex items-center gap-2 text-sm text-neutral-700 md:whitespace-nowrap">
        <input
          type="checkbox"
          checked={vegetarianOnly}
          onChange={(event) =>
            dispatch({ type: "SET_VEGETARIAN_ONLY", value: event.target.checked })
          }
        />
        {t.filters.vegetarian}
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700 md:whitespace-nowrap">
        <input
          type="checkbox"
          checked={veganOnly}
          onChange={(event) => dispatch({ type: "SET_VEGAN_ONLY", value: event.target.checked })}
        />
        {t.filters.vegan}
      </label>
      <label className="flex items-center gap-2 text-sm text-neutral-700 md:whitespace-nowrap">
        <input
          type="checkbox"
          checked={meatOnly}
          onChange={(event) => dispatch({ type: "SET_MEAT_ONLY", value: event.target.checked })}
        />
        {t.filters.meat}
      </label>
    </div>
  );
}
