export type {
  AllergenId,
  AllergenMap,
  AllergenStatus,
  AppConfig,
  DietTag,
  Dish,
  Menu,
  MenuCategory,
  PriceLevel,
  Restaurant,
  SourceKind,
} from "./schemas";

export { ALLERGEN_IDS, DIET_TAGS, SOURCE_KINDS } from "./schemas";

import type { Menu, Restaurant } from "./schemas";

/** A restaurant joined with its menu, once loaded. `menu` is undefined until DataProvider resolves it. */
export type RestaurantWithMenu = Restaurant & { menu?: Menu };
