import type { RestaurantWithMenu } from "../../data/types";
import type { LatLngLiteral, MapBoundsLiteral } from "../../maps/MapsAdapter";

const DEGREES_TO_RADIANS = Math.PI / 180;

function normalizeLongitude(longitude: number): number {
  return ((longitude + 540) % 360) - 180;
}

export function mapBoundsCenter(bounds: MapBoundsLiteral): LatLngLiteral {
  const east = bounds.east < bounds.west ? bounds.east + 360 : bounds.east;
  return {
    lat: (bounds.north + bounds.south) / 2,
    lng: normalizeLongitude((bounds.west + east) / 2),
  };
}

/**
 * Haversine's intermediate value is monotonic with great-circle distance, so it can be used
 * directly for sorting without paying for the final asin/square-root conversion to metres.
 */
function distanceScore(from: LatLngLiteral, to: LatLngLiteral): number {
  const fromLat = from.lat * DEGREES_TO_RADIANS;
  const toLat = to.lat * DEGREES_TO_RADIANS;
  const latitudeDelta = (to.lat - from.lat) * DEGREES_TO_RADIANS;
  const longitudeDelta = normalizeLongitude(to.lng - from.lng) * DEGREES_TO_RADIANS;

  const latitudeSin = Math.sin(latitudeDelta / 2);
  const longitudeSin = Math.sin(longitudeDelta / 2);

  return (
    latitudeSin * latitudeSin + Math.cos(fromLat) * Math.cos(toLat) * longitudeSin * longitudeSin
  );
}

export function sortRestaurantsByDistance(
  restaurants: RestaurantWithMenu[],
  center: LatLngLiteral,
): RestaurantWithMenu[] {
  return restaurants
    .map((restaurant, originalIndex) => ({
      restaurant,
      originalIndex,
      distance: distanceScore(center, {
        lat: restaurant.latitude,
        lng: restaurant.longitude,
      }),
    }))
    .sort((left, right) =>
      left.distance === right.distance
        ? left.originalIndex - right.originalIndex
        : left.distance - right.distance,
    )
    .map(({ restaurant }) => restaurant);
}
