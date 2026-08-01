import { useFilterDispatch, useFilterState } from "../../state/FilterStateContext";

export function CuisineFilter({ options }: { options: string[] }) {
  const { cuisineTypes } = useFilterState();
  const dispatch = useFilterDispatch();

  function toggle(cuisine: string) {
    const next = cuisineTypes.includes(cuisine)
      ? cuisineTypes.filter((c) => c !== cuisine)
      : [...cuisineTypes, cuisine];
    dispatch({ type: "SET_CUISINE_TYPES", value: next });
  }

  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium text-neutral-700">Type de cuisine</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((cuisine) => {
          const checked = cuisineTypes.includes(cuisine);
          return (
            <label
              key={cuisine}
              className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                checked
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-neutral-300 text-neutral-700"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggle(cuisine)}
              />
              {cuisine}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
