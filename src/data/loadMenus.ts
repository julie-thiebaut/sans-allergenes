import { MenuSchema, type Menu, type Restaurant } from "./schemas";

/**
 * Loads every menu referenced by `restaurants` in parallel and returns a map keyed by menuId.
 * A single restaurant's menu failing to load (network hiccup, etc.) does not fail the whole
 * app — it's logged and simply omitted, so that restaurant falls back to "menu unavailable"
 * in the UI instead of the entire list disappearing.
 */
export async function loadMenus(
  restaurants: Restaurant[],
  fetchImpl: typeof fetch = fetch,
): Promise<Map<string, Menu>> {
  const menuIds = [...new Set(restaurants.map((r) => r.menuId).filter((id): id is string => !!id))];

  const entries = await Promise.all(
    menuIds.map(async (menuId): Promise<[string, Menu] | null> => {
      const url = `${import.meta.env.BASE_URL}data/menus/${menuId}.json`;
      try {
        const response = await fetchImpl(url);
        if (!response.ok) {
          console.error(`Échec du chargement du menu ${menuId} : HTTP ${response.status}`);
          return null;
        }
        const json: unknown = await response.json();
        const result = MenuSchema.safeParse(json);
        if (!result.success) {
          console.error(`Menu ${menuId} invalide : ${result.error.message}`);
          return null;
        }
        // result.data's static type is Zod's own Partial<Record<...>>-based inference (see
        // the Dish/Menu type comment in schemas.ts); the .refine() above already guarantees
        // all 14 allergen keys are present, so this cast just realigns with that guarantee.
        return [menuId, result.data as Menu];
      } catch (error) {
        console.error(`Erreur réseau lors du chargement du menu ${menuId}`, error);
        return null;
      }
    }),
  );

  return new Map(entries.filter((entry): entry is [string, Menu] => entry !== null));
}
