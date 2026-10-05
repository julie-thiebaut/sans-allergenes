import type { Restaurant } from "../data/types";

const VEGAN_TYPE = /^v[ée]gane?$/i;
const VEGETARIAN_TYPE = /^v[ée]g[ée]tarienn?e?$/i;

type CuisineFields = Pick<Restaurant, "cuisineTypes" | "vegetarianOptions" | "veganOptions">;

/**
 * Ce que le restaurant propose aux végétariens, en une seule mention : la plus forte. Un plat
 * végane est végétarien, nommer les deux ne dit rien de plus. Pas de mention quand un type le
 * dit déjà (« Boulangerie, Café, Végan ») ; un type « Végétarien » n'empêche pas de signaler des
 * options véganes, qui en disent plus.
 */
function dietMention({ cuisineTypes, vegetarianOptions, veganOptions }: CuisineFields) {
  const typed = (pattern: RegExp) => cuisineTypes.some((type) => pattern.test(type.trim()));
  if (veganOptions) return typed(VEGAN_TYPE) ? null : "options véganes";
  if (vegetarianOptions) {
    return typed(VEGAN_TYPE) || typed(VEGETARIAN_TYPE) ? null : "options végétariennes";
  }
  return null;
}

/**
 * La ligne de type d'un restaurant, suivie de ses options végétariennes ou véganes :
 * « Burgers, Fast-food · options végétariennes ». Le point médian sépare ce qu'est le
 * restaurant de ce qu'il propose.
 */
export function cuisineLine(restaurant: CuisineFields): string {
  const types = restaurant.cuisineTypes.join(", ");
  const diet = dietMention(restaurant);
  if (!diet) return types;
  if (!types) return diet.charAt(0).toUpperCase() + diet.slice(1);
  return `${types} · ${diet}`;
}
