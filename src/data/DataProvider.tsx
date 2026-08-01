import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DataLoadError, loadRestaurants } from "./loadRestaurants";
import { loadMenus } from "./loadMenus";
import type { RestaurantWithMenu } from "./types";

export type DataState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; restaurants: RestaurantWithMenu[] };

// Exported so tests can supply a fixed DataState directly (e.g. "ready" with fixture
// restaurants) without mocking fetch — mirrors the MapsContext test-wiring pattern.
export const DataContext = createContext<DataState | null>(null);

/**
 * Loads restaurants.json plus every referenced menu file up front. The dataset is a small,
 * Paris-only demo catalog, so eager-loading everything keeps allergen-avoidance filtering
 * (which needs dish-level data across the whole list, not just one restaurant) simple and
 * correct. If the catalog grows large (France-wide), replace this with a generated
 * per-restaurant allergen-summary index instead of loading every menu upfront.
 */
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const restaurants = await loadRestaurants();
        const menus = await loadMenus(restaurants);
        if (cancelled) return;

        const restaurantsWithMenus: RestaurantWithMenu[] = restaurants.map((restaurant) => ({
          ...restaurant,
          menu: restaurant.menuId ? menus.get(restaurant.menuId) : undefined,
        }));

        setState({ status: "ready", restaurants: restaurantsWithMenus });
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof DataLoadError
            ? error.message
            : "Une erreur inattendue est survenue lors du chargement des restaurants.";
        setState({ status: "error", message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

export function useDataContext(): DataState {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
}
