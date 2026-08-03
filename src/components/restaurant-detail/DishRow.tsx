import { ALLERGEN_IDS, type AllergenId, type Dish } from "../../data/types";
import { AllergenBadge } from "./AllergenBadge";

/**
 * Allergens are grouped by status under a written heading rather than colour-coded one by one,
 * and only "present" / "may_contain" are listed — the other 12-ish statuses per dish carry no
 * information and would drown the two that do.
 *
 * Nothing here restates that missing data isn't a guarantee: AllergenSafetyDisclaimer says
 * exactly that, once, at the top of every restaurant page (including restaurants with no
 * allergen data at all). Repeating it under each dish added noise, not safety.
 */
function groupByStatus(dish: Dish): { present: AllergenId[]; mayContain: AllergenId[] } {
  const present: AllergenId[] = [];
  const mayContain: AllergenId[] = [];

  for (const id of ALLERGEN_IDS) {
    const status = dish.allergens[id];
    if (status === "present") present.push(id);
    else if (status === "may_contain") mayContain.push(id);
  }
  return { present, mayContain };
}

function AllergenGroup({
  label,
  allergens,
  listLabel,
}: {
  label: string;
  allergens: AllergenId[];
  listLabel: string;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="text-xs font-semibold text-neutral-900">{label}</span>
      <ul className="flex flex-wrap gap-1.5" aria-label={listLabel}>
        {allergens.map((allergenId) => (
          <li key={allergenId}>
            <AllergenBadge allergenId={allergenId} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DishRow({ dish }: { dish: Dish }) {
  const { present, mayContain } = groupByStatus(dish);

  return (
    <li className="border-b border-neutral-200 py-4 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="font-medium text-neutral-900">{dish.name}</h4>
        <span className="whitespace-nowrap text-neutral-700">{dish.price.toFixed(2)} €</span>
      </div>
      {dish.description && <p className="mt-1 text-sm text-neutral-600">{dish.description}</p>}

      {present.length > 0 && (
        <AllergenGroup
          label="Présent :"
          allergens={present}
          listLabel={`Allergènes présents dans ${dish.name}`}
        />
      )}

      {mayContain.length > 0 && (
        <AllergenGroup
          label="Traces possibles :"
          allergens={mayContain}
          listLabel={`Traces possibles dans ${dish.name}`}
        />
      )}

      {present.length === 0 && mayContain.length === 0 && (
        // "signalé par le restaurant" is load-bearing: it describes what was declared, not what
        // the dish contains. Without that attribution this line would read as "allergen-free",
        // which is a claim the data can never support.
        <p className="mt-2 text-xs text-neutral-500">Aucun allergène signalé par le restaurant</p>
      )}
    </li>
  );
}
