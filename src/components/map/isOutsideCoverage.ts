import type { RestaurantWithMenu } from "../../data/types";
import { isPointWithinBounds, type MapBoundsLiteral } from "../../maps/MapsAdapter";
import { distanceScore, mapBoundsCenter } from "./sortRestaurantsByDistance";

const EARTH_RADIUS_KM = 6371;
// Measured on the published restaurants (November 2026): Paris proper is within 1 km of one,
// bar the Bois de Vincennes, while most neighbouring towns are further.
const COVERAGE_RADIUS_KM = 1;
const COVERAGE_SCORE = Math.sin(COVERAGE_RADIUS_KM / (2 * EARTH_RADIUS_KM)) ** 2;

/**
 * Whether the map is looking somewhere the site has not reached yet. An empty view is not enough:
 * zoomed in on a Paris street there may be nothing either, and that is not a place to tell the
 * visitor the site has yet to reach. Takes every restaurant, not the filtered ones, since a
 * filter hiding them does not make the area uncovered.
 */
export function isOutsideCoverage(
  bounds: MapBoundsLiteral,
  restaurants: RestaurantWithMenu[],
): boolean {
  const center = mapBoundsCenter(bounds);
  return restaurants.every((restaurant) => {
    const position = { lat: restaurant.latitude, lng: restaurant.longitude };
    return (
      !isPointWithinBounds(position, bounds) && distanceScore(center, position) > COVERAGE_SCORE
    );
  });
}
