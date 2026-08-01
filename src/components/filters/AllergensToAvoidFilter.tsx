import { ALLERGEN_LABELS_FR, ALLERGENS_SORTED_FR } from "../../data/allergenLabels";
import type { AllergenId } from "../../data/types";
import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function AllergensToAvoidFilter() {
  const { allergensToAvoid } = useFilterState();
  const dispatch = useFilterDispatch();

  function toggle(id: AllergenId) {
    const next = allergensToAvoid.includes(id)
      ? allergensToAvoid.filter((a) => a !== id)
      : [...allergensToAvoid, id];
    dispatch({ type: "SET_ALLERGENS_TO_AVOID", value: next });
  }

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-neutral-700">Allergènes à éviter</legend>
      <p className="mb-2 text-xs text-neutral-500">
        Les restaurants dont un plat déclare cet allergène comme présent sont exclus des résultats.
        Les mentions « traces possibles » ou « information incomplète » restent affichées : rester
        dans la liste ne constitue jamais une garantie pour ce restaurant.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ALLERGENS_SORTED_FR.map((id) => {
          const checked = allergensToAvoid.includes(id);
          return (
            <label
              key={id}
              className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                checked
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-neutral-300 text-neutral-700"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggle(id)}
              />
              {ALLERGEN_LABELS_FR[id]}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
