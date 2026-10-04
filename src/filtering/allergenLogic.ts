import type { AllergenId, AllergenMap, Menu, MenuCategory } from "../data/types";
import { isDrinkCategory } from "./drinkCategories";

/**
 * Safety-critical chokepoint: this is the ONLY place in the app allowed to turn raw
 * allergen statuses into an "avoidance" judgement. `AllergenStatus` has no "safe"/"absent"
 * value by design, so there is intentionally NO possible outcome here meaning "confirmed
 * free of the avoided allergen(s)". The mildest outcome, `not_declared_for_avoided`, only
 * reports what the document says ("the restaurant declares none of them for this dish"), and
 * must be worded that way: never "sans", never "sûr". Every caller (filtering AND UI badges)
 * must route through this function rather than inventing their own judgement.
 */
export type AllergenAvoidanceAssessment =
  | "contains_avoided" // at least one avoided allergen is "present"
  | "may_contain_avoided" // no "present", but at least one avoided allergen is "may_contain"
  | "incomplete_info_for_avoided" // neither, but at least one avoided allergen is "unknown"
  | "not_declared_for_avoided" // every avoided allergen is "not_declared": the document is silent
  | "no_allergens_selected"; // the user hasn't selected any allergens to avoid

export function assessDishAgainstAvoidance(
  allergens: AllergenMap,
  avoid: AllergenId[],
): AllergenAvoidanceAssessment {
  if (avoid.length === 0) return "no_allergens_selected";

  const statuses = avoid.map((id) => allergens[id]);
  if (statuses.some((status) => status === "present")) return "contains_avoided";
  if (statuses.some((status) => status === "may_contain")) return "may_contain_avoided";
  if (statuses.some((status) => status === "unknown")) return "incomplete_info_for_avoided";
  return "not_declared_for_avoided";
}

export interface AvoidanceOptions {
  /**
   * The visitor's choice to set aside "may_contain" dishes as well. Off by default: traces are a
   * risk the visitor weighs, not a declaration of the allergen as an ingredient.
   */
  excludeTraces?: boolean;
}

/** Whether a dish is set aside: declared present, or declared as traces when the visitor asks. */
function isSetAside(
  assessment: AllergenAvoidanceAssessment,
  { excludeTraces = false }: AvoidanceOptions,
): boolean {
  return (
    assessment === "contains_avoided" || (excludeTraces && assessment === "may_contain_avoided")
  );
}

export interface DeclaringCount {
  /** Dishes set aside: declaring an avoided allergen as present (or as traces, when excluded). */
  declaring: number;
  /** Dishes declaring traces of one, and none as present, when traces aren't excluded. */
  traces: number;
  /** Dishes declaring neither, whose document doesn't cover an avoided allergen at all. */
  unknown: number;
  total: number;
}

/**
 * What a menu's dishes declare for the avoided allergens, dish by dish — with the drinks counted
 * apart (see `isDrinkCategory`), since a soda is not a dish. `declaring` is what decides whether
 * a RESTAURANT is worth listing: one offending dish out of ten shouldn't remove an establishment
 * where nine dishes are still on the table. Returns zero totals when there is no menu, so callers
 * can tell "nothing declared" apart from "nothing left".
 */
export function countDishesDeclaringAvoided(
  menu: Menu | undefined,
  avoid: AllergenId[],
  options: AvoidanceOptions = {},
): { dishes: DeclaringCount; drinks: DeclaringCount } {
  const dishes = { declaring: 0, traces: 0, unknown: 0, total: 0 };
  const drinks = { declaring: 0, traces: 0, unknown: 0, total: 0 };
  if (!menu || avoid.length === 0) return { dishes, drinks };

  for (const category of menu.categories) {
    const count = isDrinkCategory(menu.menuId, category.category) ? drinks : dishes;
    for (const dish of category.dishes) {
      count.total += 1;
      const assessment = assessDishAgainstAvoidance(dish.allergens, avoid);
      if (isSetAside(assessment, options)) count.declaring += 1;
      else if (assessment === "may_contain_avoided") count.traces += 1;
      else if (assessment === "incomplete_info_for_avoided") count.unknown += 1;
    }
  }

  return { dishes, drinks };
}

/**
 * Dish-level filtering for a single restaurant's menu. ONLY a confirmed "present" match is
 * removed, plus "may_contain" when the visitor excludes traces. Dishes whose info is missing
 * entirely deliberately stay visible — dropping them would leave a menu that reads as "these
 * dishes are fine", a guarantee the data cannot support.
 * `excludedDishCount` and `excludedDrinkCount` let the UI say out loud that something was hidden.
 */
export function filterMenuAgainstAvoidance(
  menu: Menu,
  avoid: AllergenId[],
  options: AvoidanceOptions = {},
): { categories: MenuCategory[]; excludedDishCount: number; excludedDrinkCount: number } {
  if (avoid.length === 0) {
    return { categories: menu.categories, excludedDishCount: 0, excludedDrinkCount: 0 };
  }

  let excludedDishCount = 0;
  let excludedDrinkCount = 0;
  const categories = menu.categories
    .map((category) => {
      const isDrink = isDrinkCategory(menu.menuId, category.category);
      return {
        ...category,
        dishes: category.dishes.filter((dish) => {
          const excluded = isSetAside(assessDishAgainstAvoidance(dish.allergens, avoid), options);
          if (excluded && isDrink) excludedDrinkCount += 1;
          else if (excluded) excludedDishCount += 1;
          return !excluded;
        }),
      };
    })
    .filter((category) => category.dishes.length > 0);

  return { categories, excludedDishCount, excludedDrinkCount };
}
