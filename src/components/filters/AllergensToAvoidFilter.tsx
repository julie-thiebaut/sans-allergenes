import { ALLERGEN_ICONS, ALLERGENS_SORTED } from "../../data/allergenLabels";
import type { AllergenId } from "../../data/types";
import { useLocale, useMessages } from "../../i18n/useLocale";
import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

/**
 * `description` is overridable because the same control filters two different things (the
 * restaurant list, and a single restaurant's menu) and must state precisely what it excludes
 * in each case — vague wording here is exactly how a filter gets mistaken for a safety filter.
 */
export function AllergensToAvoidFilter({ description }: { description?: string }) {
  const { allergensToAvoid, excludeTraces } = useFilterState();
  const dispatch = useFilterDispatch();
  const locale = useLocale();
  const t = useMessages();

  function toggle(id: AllergenId) {
    const next = allergensToAvoid.includes(id)
      ? allergensToAvoid.filter((a) => a !== id)
      : [...allergensToAvoid, id];
    dispatch({ type: "SET_ALLERGENS_TO_AVOID", value: next });
  }

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-neutral-700">
        {t.filters.allergensToAvoid}
      </legend>
      <p className="mb-2 text-xs text-neutral-500">
        {description ?? t.filters.listDescription(excludeTraces, allergensToAvoid.length > 1)}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ALLERGENS_SORTED[locale].map((id) => {
          const checked = allergensToAvoid.includes(id);
          return (
            <label
              key={id}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm ${
                checked
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-neutral-300 text-neutral-700"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggle(id)}
              />
              <span aria-hidden="true">{ALLERGEN_ICONS[id]}</span>
              <span className={checked ? "line-through decoration-2" : undefined}>
                {t.allergens[id]}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
