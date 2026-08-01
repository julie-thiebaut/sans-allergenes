import { useEffect, useRef } from "react";
import type { RestaurantWithMenu } from "../../data/types";
import { useSelectionContext } from "../../state/SelectionContext";
import { RestaurantCard } from "./RestaurantCard";

export function RestaurantList({ restaurants }: { restaurants: RestaurantWithMenu[] }) {
  const { selectedId } = useSelectionContext();
  const cardRefs = useRef(new Map<string, HTMLLIElement>());

  useEffect(() => {
    if (!selectedId) return;
    cardRefs.current.get(selectedId)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  if (restaurants.length === 0) {
    return (
      <p className="p-6 text-center text-neutral-500">
        Aucun restaurant ne correspond à votre recherche. Essayez d&rsquo;élargir vos filtres.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3 overflow-y-auto p-3" aria-label="Liste des restaurants">
      {restaurants.map((restaurant) => (
        <li
          key={restaurant.id}
          ref={(el) => {
            if (el) cardRefs.current.set(restaurant.id, el);
            else cardRefs.current.delete(restaurant.id);
          }}
        >
          <RestaurantCard restaurant={restaurant} />
        </li>
      ))}
    </ul>
  );
}
