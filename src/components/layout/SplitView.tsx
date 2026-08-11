import { useMemo, useState } from "react";
import type { RestaurantWithMenu } from "../../data/types";
import { filterRestaurants } from "../../filtering/filterRestaurants";
import { PARIS_CENTER } from "../../maps/MapsAdapter";
import { useFilterState } from "../../state/FilterStateContext";
import { useMapBoundsContext } from "../../state/mapBoundsContext";
import { useMediaQuery } from "../../utils/useMediaQuery";
import { MobileFilterSheet } from "../filters/MobileFilterSheet";
import { SearchFilterBar } from "../filters/SearchFilterBar";
import { MapView } from "../map/MapView";
import { mapBoundsToRestaurantIds } from "../map/mapBoundsToRestaurantIds";
import { mapBoundsCenter, sortRestaurantsByDistance } from "../map/sortRestaurantsByDistance";
import { ResultCount } from "../restaurant-list/ResultCount";
import { RestaurantList } from "../restaurant-list/RestaurantList";
import { MobileViewToggle, type MobileViewMode } from "./MobileViewToggle";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

export function SplitView({ allRestaurants }: { allRestaurants: RestaurantWithMenu[] }) {
  const filters = useFilterState();
  const { bounds } = useMapBoundsContext();
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);
  const [mobileView, setMobileView] = useState<MobileViewMode>("map");

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

      <ResultCount count={visibleInList.length} />

      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(360px,1fr)_1.4fr]">
        {(isDesktop || mobileView === "list") && (
          <div className="min-h-0 overflow-y-auto">
            <RestaurantList restaurants={visibleInList} />
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
