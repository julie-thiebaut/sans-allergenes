import type { Restaurant } from "../data/types";
import { CUISINE_TYPES_EN } from "../i18n/cuisineTypesEn";
import type { Locale } from "../i18n/locale";
import { MESSAGES } from "../i18n/messages";

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
function plantBasedDiet(
  { cuisineTypes, vegetarianOptions, veganOptions }: CuisineFields,
  locale: Locale,
) {
  const words = MESSAGES[locale].cuisine;
  const typed = (pattern: RegExp) => cuisineTypes.some((type) => pattern.test(type.trim()));
  if (veganOptions) return typed(VEGAN_TYPE) ? null : words.vegan;
  if (vegetarianOptions)
    return typed(VEGAN_TYPE) || typed(VEGETARIAN_TYPE) ? null : words.vegetarian;
  return null;
}

function dietMention(restaurant: CuisineFields, locale: Locale) {
  const words = MESSAGES[locale].cuisine;
  const plantBased = plantBasedDiet(restaurant, locale);
  const diets = [plantBased, restaurant.meatOptions ? words.meat : null].filter(
    (diet): diet is string => diet !== null,
  );
  return diets.length > 0 ? words.dietMention(diets) : null;
}

/**
 * Les origines sont enregistrées au féminin (« cuisine française »), ce qui sonne faux à côté
 * d'un type : « Bistrot, Française ». Elles s'affichent donc au masculin. Les fiches ne changent
 * pas : leurs étiquettes entrent dans l'empreinte du registre de relecture. Une origine absente
 * de cette table s'affiche telle qu'elle est enregistrée, à sa place dans la fiche.
 */
const ORIGIN_LABELS = new Map([
  ["Africaine", "Africain"],
  ["Américaine", "Américain"],
  ["Asiatique", "Asiatique"],
  ["Belge", "Belge"],
  ["Chinoise", "Chinois"],
  ["Coréenne", "Coréen"],
  ["Finlandaise", "Finlandais"],
  ["Française", "Français"],
  ["Grecque", "Grec"],
  ["Indienne", "Indien"],
  ["Irlandais", "Irlandais"],
  ["Italienne", "Italien"],
  ["Japonaise", "Japonais"],
  ["Libanaise", "Libanais"],
  ["Lyonnaise", "Lyonnais"],
  ["Méditerranéenne", "Méditerranéen"],
  ["Mexicaine", "Mexicain"],
  ["Savoyarde", "Savoyard"],
  ["Thaïlandaise", "Thaïlandais"],
  ["Tunisienne", "Tunisien"],
  ["Turque", "Turc"],
  ["Vietnamienne", "Vietnamien"],
]);

/**
 * Les étiquettes telles qu'on les lit : ce qu'est le restaurant d'abord, son origine ensuite,
 * quel que soit l'ordre de la fiche (« Bistrot, Français » comme « Pub, Irlandais »).
 */
export function cuisineLabels(cuisineTypes: string[], locale: Locale = "fr"): string {
  const types = cuisineTypes.filter((type) => !ORIGIN_LABELS.has(type));
  const origins = cuisineTypes.filter((type) => ORIGIN_LABELS.has(type));
  if (locale === "en") {
    return [...types, ...origins].map((type) => CUISINE_TYPES_EN.get(type) ?? type).join(", ");
  }
  return [...types, ...origins.map((type) => ORIGIN_LABELS.get(type) ?? type)].join(", ");
}

/**
 * La ligne de type d'un restaurant, suivie des régimes qu'il sert :
 * « Burgers, Fast-food · plats végétariens et carnés disponibles ». Le point médian sépare ce
 * qu'est le restaurant de ce qu'il propose.
 */
export function cuisineLine(restaurant: CuisineFields, locale: Locale = "fr"): string {
  const types = cuisineLabels(restaurant.cuisineTypes, locale);
  const diet = dietMention(restaurant, locale);
  if (!diet) return types;
  if (!types) return diet.charAt(0).toUpperCase() + diet.slice(1);
  return `${types} · ${diet}`;
}
