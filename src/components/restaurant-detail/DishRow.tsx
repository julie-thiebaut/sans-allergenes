import { ALLERGEN_IDS, type AllergenId, type Dish } from "../../data/types";
import type { Locale } from "../../i18n/locale";
import { useMessages } from "../../i18n/useLocale";
import { AllergenBadge } from "./AllergenBadge";

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

/** `quotedIn`: the dish's language, when it differs from the page's (see MenuSection). */
export function DishRow({ dish, quotedIn }: { dish: Dish; quotedIn?: Locale }) {
  const t = useMessages();
  const { present, mayContain } = groupByStatus(dish);

  return (
    // Pas de marge haute au premier plat : le titre de rubrique doit être plus près de ses plats
    // que de ce qui le précède (le bouton de filtre, sur mobile, n'est qu'à 1 rem au-dessus).
    <li className="border-b border-neutral-200 py-4 first:pt-0 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        {/* Diet tags sit inline with the name: they qualify the dish itself, so reading them
            after the title (rather than under the description) matches how the name is read. */}
        <h4 className="font-medium text-neutral-900">
          <span lang={quotedIn}>{dish.name}</span>
          {dish.tags && dish.tags.length > 0 && (
            <span
              className="ml-2 inline-flex flex-wrap gap-1.5 align-middle"
              aria-label={t.restaurant.dish.diets(dish.name)}
            >
              {dish.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800"
                >
                  {t.dietTags[tag]}
                </span>
              ))}
            </span>
          )}
        </h4>
        {dish.price !== undefined && (
          <span className="whitespace-nowrap text-neutral-700">{dish.price.toFixed(2)} €</span>
        )}
      </div>
      {dish.description && (
        <p lang={quotedIn} className="mt-1 text-sm text-neutral-600">
          {dish.description}
        </p>
      )}

      {present.length > 0 && (
        <AllergenGroup
          label={t.restaurant.dish.present}
          allergens={present}
          listLabel={t.restaurant.dish.presentList(dish.name)}
        />
      )}

      {mayContain.length > 0 && (
        <AllergenGroup
          label={t.restaurant.dish.mayContain}
          allergens={mayContain}
          listLabel={t.restaurant.dish.mayContainList(dish.name)}
        />
      )}

      {present.length === 0 && mayContain.length === 0 && (
        // "signalé par le restaurant" is load-bearing: it describes what was declared, not what
        // the dish contains. Without that attribution this line would read as "allergen-free",
        // which is a claim the data can never support.
        <p className="mt-2 text-xs text-neutral-500">{t.restaurant.dish.noneDeclared}</p>
      )}
    </li>
  );
}
