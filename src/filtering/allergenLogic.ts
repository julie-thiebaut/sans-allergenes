import type { AllergenId, AllergenMap, Menu } from "../data/types";

/**
 * Safety-critical chokepoint: this is the ONLY place in the app allowed to turn raw
 * allergen statuses into an "avoidance" judgement. `AllergenStatus` has no "safe"/"absent"
 * value by design, so there is intentionally NO possible outcome here meaning "confirmed
 * free of the avoided allergen(s)" — the best this can ever say is "nothing present or
 * flagged as traces, but the info may simply be incomplete." Every caller (filtering AND
 * UI badges) must route through this function rather than inventing their own wording.
 */
export type AllergenAvoidanceAssessment =
  | "contains_avoided" // at least one avoided allergen is "present"
  | "may_contain_avoided" // no "present", but at least one avoided allergen is "may_contain"
  | "incomplete_info_for_avoided" // no confirmed match, but info is "unknown"/"not_declared" or missing entirely
  | "no_allergens_selected"; // the user hasn't selected any allergens to avoid

const ASSESSMENT_SEVERITY: Record<AllergenAvoidanceAssessment, number> = {
  no_allergens_selected: 0,
  incomplete_info_for_avoided: 1,
  may_contain_avoided: 2,
  contains_avoided: 3,
};

export function assessDishAgainstAvoidance(
  allergens: AllergenMap,
  avoid: AllergenId[],
): AllergenAvoidanceAssessment {
  if (avoid.length === 0) return "no_allergens_selected";

  const statuses = avoid.map((id) => allergens[id]);
  if (statuses.some((status) => status === "present")) return "contains_avoided";
  if (statuses.some((status) => status === "may_contain")) return "may_contain_avoided";
  // Remaining possible statuses are "unknown" / "not_declared" — never treated as safe.
  return "incomplete_info_for_avoided";
}

/**
 * Restaurant/menu-level rollup: the worst (most restrictive) assessment across every dish.
 * `menu` being undefined (no menu data loaded at all) is treated as incomplete info, never
 * as an all-clear.
 */
export function assessMenuAgainstAvoidance(
  menu: Menu | undefined,
  avoid: AllergenId[],
): AllergenAvoidanceAssessment {
  if (avoid.length === 0) return "no_allergens_selected";
  if (!menu) return "incomplete_info_for_avoided";

  const dishAssessments = menu.categories.flatMap((category) =>
    category.dishes.map((dish) => assessDishAgainstAvoidance(dish.allergens, avoid)),
  );

  return dishAssessments.reduce<AllergenAvoidanceAssessment>(
    (worst, current) =>
      ASSESSMENT_SEVERITY[current] > ASSESSMENT_SEVERITY[worst] ? current : worst,
    "incomplete_info_for_avoided",
  );
}
