import { ALLERGEN_IDS } from "../../src/data/schemas";
import type { AllergenId, AllergenMap, AllergenStatus, Menu } from "../../src/data/types";

export function makeAllergenMap(
  overrides: Partial<Record<AllergenId, AllergenStatus>> = {},
): AllergenMap {
  const base = Object.fromEntries(ALLERGEN_IDS.map((id) => [id, "not_declared"])) as AllergenMap;
  return { ...base, ...overrides };
}

export const fullInfoMenu: Menu = {
  menuId: "menu-full-info",
  restaurantId: "rest-full-info",
  categories: [
    {
      category: "Plats",
      dishes: [
        {
          id: "dish-gluten-present",
          name: "Plat au blé",
          price: 12,
          allergens: makeAllergenMap({ gluten: "present", lait: "may_contain" }),
        },
        {
          id: "dish-clean-declared",
          name: "Salade simple",
          price: 8,
          allergens: makeAllergenMap(),
        },
      ],
    },
  ],
};

export const unknownInfoMenu: Menu = {
  menuId: "menu-unknown-info",
  restaurantId: "rest-unknown-info",
  categories: [
    {
      category: "Plats",
      dishes: [
        {
          id: "dish-all-unknown",
          name: "Plat mystère",
          price: 10,
          allergens: makeAllergenMap(
            Object.fromEntries(ALLERGEN_IDS.map((id) => [id, "unknown"])) as Partial<
              Record<AllergenId, AllergenStatus>
            >,
          ),
        },
      ],
    },
  ],
};
