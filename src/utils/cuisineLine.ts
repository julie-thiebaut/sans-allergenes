import type { Restaurant } from "../data/types";

const VEGAN_TYPE = /^v[ée]gane?$/i;
const VEGETARIAN_TYPE = /^v[ée]g[ée]tarienn?e?$/i;

type CuisineFields = Pick<
  Restaurant,
  "cuisineTypes" | "vegetarianOptions" | "veganOptions" | "meatOptions"
>;

/**
 * Ce que le restaurant propose aux végétariens, en un seul mot : le plus fort. Un plat
 * végétalien est végétarien, nommer les deux ne dit rien de plus. Rien quand un type le dit
 * déjà (« Boulangerie, Café, Végan ») ; un type « Végétarien » n'empêche pas de signaler des
 * plats végétaliens, qui en disent plus.
 */
function plantBasedDiet({ cuisineTypes, vegetarianOptions, veganOptions }: CuisineFields) {
  const typed = (pattern: RegExp) => cuisineTypes.some((type) => pattern.test(type.trim()));
  if (veganOptions) return typed(VEGAN_TYPE) ? null : "végétaliens";
  if (vegetarianOptions) return typed(VEGAN_TYPE) || typed(VEGETARIAN_TYPE) ? null : "végétariens";
  return null;
}

function dietMention(restaurant: CuisineFields) {
  const plantBased = plantBasedDiet(restaurant);
  const diets = [plantBased, restaurant.meatOptions ? "carnés" : null].filter(Boolean);
  return diets.length > 0 ? `plats ${diets.join(" et ")} disponibles` : null;
}

/**
 * La ligne de type d'un restaurant, suivie des régimes qu'il sert :
 * « Burgers, Fast-food · plats végétariens et carnés disponibles ». Le point médian sépare ce
 * qu'est le restaurant de ce qu'il propose.
 */
export function cuisineLine(restaurant: CuisineFields): string {
  const types = restaurant.cuisineTypes.join(", ");
  const diet = dietMention(restaurant);
  if (!diet) return types;
  if (!types) return diet.charAt(0).toUpperCase() + diet.slice(1);
  return `${types} · ${diet}`;
}
