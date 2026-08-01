import { ALLERGEN_IDS, type Dish } from "../../data/types";
import { AllergenBadge } from "./AllergenBadge";

export function DishRow({ dish }: { dish: Dish }) {
  return (
    <li className="border-b border-neutral-200 py-4 last:border-b-0">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="font-medium text-neutral-900">{dish.name}</h4>
        <span className="whitespace-nowrap text-neutral-700">{dish.price.toFixed(2)} €</span>
      </div>
      {dish.description && <p className="mt-1 text-sm text-neutral-600">{dish.description}</p>}
      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`Allergènes pour ${dish.name}`}>
        {ALLERGEN_IDS.map((allergenId) => (
          <li key={allergenId}>
            <AllergenBadge allergenId={allergenId} status={dish.allergens[allergenId]} />
          </li>
        ))}
      </ul>
    </li>
  );
}
