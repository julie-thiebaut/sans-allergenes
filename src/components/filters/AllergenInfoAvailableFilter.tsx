import { useMessages } from "../../i18n/useLocale";
import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function AllergenInfoAvailableFilter() {
  const { allergenInfoAvailableOnly } = useFilterState();
  const dispatch = useFilterDispatch();
  const t = useMessages();

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-700 md:whitespace-nowrap">
      <input
        type="checkbox"
        checked={allergenInfoAvailableOnly}
        onChange={(event) =>
          dispatch({ type: "SET_ALLERGEN_INFO_AVAILABLE_ONLY", value: event.target.checked })
        }
      />
      {t.filters.allergenInfoOnly}
    </label>
  );
}
