import { ALLERGEN_IDS, type AllergenId, type DietTag, type Dish } from "../../data/types";
import { AllergenBadge } from "./AllergenBadge";

const DIET_TAG_LABELS: Record<DietTag, string> = {
  vegetarien: "Végétarien",
  vegan: "Végan",
};

/**
 * Allergens are grouped by status under a written heading rather than colour-coded one by one,
 * and only "present" / "may_contain" are listed — the other 12-ish statuses per dish carry no
 * information and would drown the two that do.
 *
 * Nothing here restates that missing data isn't a guarantee: AllergenSafetyDisclaimer says
 * exactly that, once, right after the menu on every restaurant page (including restaurants with no
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
    // Pas de marge haute au premier plat : le titre de rubrique doit être plus près de ses plats
    // que de ce qui le précède (le bouton de filtre, sur mobile, n'est qu'à 1 rem au-dessus).
    <li className="border-b border-neutral-200 py-4 first:pt-0 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        {/* Diet tags sit inline with the name: they qualify the dish itself, so reading them
            after the title (rather than under the description) matches how the name is read. */}
        <h4 className="font-medium text-neutral-900">
          {dish.name}
          {dish.tags && dish.tags.length > 0 && (
            <span
              className="ml-2 inline-flex flex-wrap gap-1.5 align-middle"
              aria-label={`Régimes signalés pour ${dish.name}`}
            >
              {dish.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800"
                >
                  {DIET_TAG_LABELS[tag]}
                </span>
              ))}
            </span>
          )}
        </h4>
        {dish.price !== undefined && (
          <span className="whitespace-nowrap text-neutral-700">{dish.price.toFixed(2)} €</span>
        )}
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
