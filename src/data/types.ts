export type {
  AllergenId,
  AllergenMap,
  AllergenStatus,
  AppConfig,
  Dish,
  Menu,
  MenuCategory,
  PriceLevel,
  Restaurant,
} from "./schemas";

export { ALLERGEN_IDS } from "./schemas";

import type { Menu, Restaurant } from "./schemas";

/** A restaurant joined with its menu, once loaded. `menu` is undefined until DataProvider resolves it. */
export type RestaurantWithMenu = Restaurant & { menu?: Menu };
