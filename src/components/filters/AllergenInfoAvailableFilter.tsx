import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function AllergenInfoAvailableFilter() {
  const { allergenInfoAvailableOnly } = useFilterState();
  const dispatch = useFilterDispatch();

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-700">
      <input
        type="checkbox"
        checked={allergenInfoAvailableOnly}
        onChange={(event) =>
          dispatch({ type: "SET_ALLERGEN_INFO_AVAILABLE_ONLY", value: event.target.checked })
        }
      />
      Informations allergènes disponibles uniquement
    </label>
  );
}
