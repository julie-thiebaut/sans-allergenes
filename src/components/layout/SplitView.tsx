import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RestaurantWithMenu } from "../../data/types";
import { filterRestaurants } from "../../filtering/filterRestaurants";
import { PARIS_CENTER } from "../../maps/MapsAdapter";
import { useFilterState } from "../../state/FilterStateContext";
import { useMapBoundsContext } from "../../state/mapBoundsContext";
import { sameBounds, useMapPageMemory } from "../../state/MapPageMemoryContext";
import { formatMonthYear } from "../../utils/formatDate";
import { useMediaQuery } from "../../utils/useMediaQuery";
import { MobileFilterSheet } from "../filters/MobileFilterSheet";
import { SearchFilterBar } from "../filters/SearchFilterBar";
import { isOutsideCoverage } from "../map/isOutsideCoverage";
import { MapView } from "../map/MapView";
import { mapBoundsToRestaurantIds } from "../map/mapBoundsToRestaurantIds";
import { OutsideCoverageBanner } from "../map/OutsideCoverageBanner";
import { mapBoundsCenter, sortRestaurantsByDistance } from "../map/sortRestaurantsByDistance";
import { ResultCount } from "../restaurant-list/ResultCount";
import { RestaurantList } from "../restaurant-list/RestaurantList";
import { MobileViewToggle, type MobileViewMode } from "./MobileViewToggle";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

// ISO dates compare correctly as plain text.
function latestUpdate(restaurants: RestaurantWithMenu[]): string | undefined {
  return restaurants.reduce<string | undefined>(
    (latest, { lastVerifiedAt }) =>
      lastVerifiedAt && (!latest || lastVerifiedAt > latest) ? lastVerifiedAt : latest,
    undefined,
  );
}

export function SplitView({ allRestaurants }: { allRestaurants: RestaurantWithMenu[] }) {
  const filters = useFilterState();
  const { bounds } = useMapBoundsContext();
  const memory = useMapPageMemory();
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const [mobileView, setMobileView] = useState<MobileViewMode>(memory?.mobileView ?? "map");
  const showList = isDesktop || mobileView === "list";
  const listScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (memory) memory.mobileView = mobileView;
  }, [memory, mobileView]);

  // Put the list back where it was scrolled, each time it appears: back from a restaurant, or
  // back from the mobile map view. Only if it is still the same list — after the map has moved,
  // the old offset would land in the middle of different restaurants, and the nearest ones at
  // the top are the right place to start. Layout effect, so it lands before the first paint and
  // before RestaurantList's scroll-to-selection, which then finds the card already in view.
  useLayoutEffect(() => {
    const list = listScrollRef.current;
    if (!showList || !list || !memory) return;
    if (sameBounds(memory.listScroll.bounds, bounds)) list.scrollTop = memory.listScroll.top;
    // Only when the list (re)appears: a later bounds change must not yank the scroll position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showList]);

  const filteredRestaurants = useMemo(
    () => filterRestaurants(allRestaurants, filters),
    [allRestaurants, filters],
  );

  // The map always shows every filtered restaurant; the LIST is further clipped to the
  // currently visible map bounds, then ordered from the map's centre outwards.
  const visibleInList = useMemo(() => {
    let visibleRestaurants = filteredRestaurants;
    if (bounds) {
      const visibleIds = mapBoundsToRestaurantIds(bounds, filteredRestaurants);
      visibleRestaurants = filteredRestaurants.filter((restaurant) =>
        visibleIds.has(restaurant.id),
      );
    }

    const center = bounds ? mapBoundsCenter(bounds) : PARIS_CENTER;
    return sortRestaurantsByDistance(visibleRestaurants, center);
  }, [filteredRestaurants, bounds]);

  // From the whole catalog, not the filtered list: filters must not change when the site was updated.
  const lastUpdate = useMemo(() => latestUpdate(allRestaurants), [allRestaurants]);

  const outsideCoverage = useMemo(
    () => bounds !== null && isOutsideCoverage(bounds, allRestaurants),
    [allRestaurants, bounds],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="hidden md:block">
        <SearchFilterBar />
      </div>

      {/* View switcher left, filter action right — the filter button keeps the same corner
          across the app, so it stays where the user last found it. */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-white p-3 md:hidden">
        <MobileViewToggle value={mobileView} onChange={setMobileView} />
        <MobileFilterSheet title="Filtrer par allergènes">
          <SearchFilterBar />
        </MobileFilterSheet>
      </div>

      {/* The information may have changed since this date, so visitors see it above the map. On
          the count's line, it takes no height from the map; outside ResultCount, since that one's
          live region should only announce the count. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 px-3 py-2">
        <ResultCount count={visibleInList.length} />
        {lastUpdate && (
          <p className="text-xs text-neutral-600 md:text-sm">
            Mise à jour : {formatMonthYear(lastUpdate)}
          </p>
        )}
      </div>

      {/* Above the two panes rather than in the list: on a phone the map view has no list. */}
      {outsideCoverage && <OutsideCoverageBanner />}

      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(360px,1fr)_1.4fr]">
        {showList && (
          <div
            ref={listScrollRef}
            className="min-h-0 overflow-y-auto"
            onScroll={(event) => {
              if (memory) memory.listScroll = { top: event.currentTarget.scrollTop, bounds };
            }}
          >
            {/* The same condition as the layout effect above, which scrolls it back there. */}
            <RestaurantList
              restaurants={visibleInList}
              initialScrollTop={
                memory && sameBounds(memory.listScroll.bounds, bounds) ? memory.listScroll.top : 0
              }
            />
          </div>
        )}
        {(isDesktop || mobileView === "map") && (
          <div className="min-h-0">
            <MapView restaurants={filteredRestaurants} showSelectionPreview={!isDesktop} />
          </div>
        )}
      </div>
    </div>
  );
}
