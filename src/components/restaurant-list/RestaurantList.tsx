import { startTransition, useEffect, useRef, useState } from "react";
import type { RestaurantWithMenu } from "../../data/types";
import { useMessages } from "../../i18n/useLocale";
import { IS_PRERENDERING } from "../../seo/prerendering";
import { useSelectionContext } from "../../state/SelectionContext";
import { RestaurantCard } from "./RestaurantCard";

// Hundreds of cards take more than a second to build on a phone. The first ones fill a tall
// screen; the others follow a batch at a time, in the background.
const FIRST_CARDS = 20;
const CARDS_PER_BATCH = 40;
// The least height a card takes with its gap, 8.25rem + 2px: 134px at the default font size,
// still more than this down to a 12px font.
const SMALLEST_CARD_PX = 100;

export function RestaurantList({
  restaurants,
  initialScrollTop = 0,
}: {
  restaurants: RestaurantWithMenu[];
  /** Where SplitView scrolls the list back to as it mounts: the cards down to there must exist. */
  initialScrollTop?: number;
}) {
  const { hoveredId, selectedId } = useSelectionContext();
  const t = useMessages();
  const cardRefs = useRef(new Map<string, HTMLLIElement>());
  const [builtCount, setBuiltCount] = useState(() =>
    // The prerendered page carries the whole list, for the crawlers that do not run the script.
    IS_PRERENDERING
      ? Infinity
      : Math.max(
          FIRST_CARDS,
          Math.ceil((initialScrollTop + window.innerHeight) / SMALLEST_CARD_PX),
        ),
  );
  // The selected card always exists, for the scroll below to find it.
  const shownCount = Math.max(
    builtCount,
    restaurants.findIndex((restaurant) => restaurant.id === selectedId) + 1,
  );

  useEffect(() => {
    if (shownCount >= restaurants.length) return;
    // After this frame, and as a transition, so that a tap never waits behind a batch.
    const timer = setTimeout(() =>
      startTransition(() => setBuiltCount(shownCount + CARDS_PER_BATCH)),
    );
    return () => clearTimeout(timer);
  }, [shownCount, restaurants.length]);

  useEffect(() => {
    if (!selectedId) return;
    cardRefs.current.get(selectedId)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  if (restaurants.length === 0) {
    return <p className="p-6 text-center text-neutral-500">{t.list.empty}</p>;
  }

  return (
    <ul className="flex flex-col gap-3 overflow-y-auto p-3" aria-label={t.list.label}>
      {restaurants.slice(0, shownCount).map((restaurant) => (
        <li
          key={restaurant.id}
          ref={(el) => {
            if (el) cardRefs.current.set(restaurant.id, el);
            else cardRefs.current.delete(restaurant.id);
          }}
        >
          <RestaurantCard
            restaurant={restaurant}
            isHighlighted={restaurant.id === hoveredId || restaurant.id === selectedId}
          />
        </li>
      ))}
    </ul>
  );
}
