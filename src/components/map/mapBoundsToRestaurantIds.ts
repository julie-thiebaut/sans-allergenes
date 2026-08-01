import type { RestaurantWithMenu } from "../../data/types";
import { isPointWithinBounds, type MapBoundsLiteral } from "../../maps/MapsAdapter";

export function mapBoundsToRestaurantIds(
  bounds: MapBoundsLiteral,
  restaurants: RestaurantWithMenu[],
): Set<string> {
  return new Set(
    restaurants
      .filter((restaurant) =>
        isPointWithinBounds({ lat: restaurant.latitude, lng: restaurant.longitude }, bounds),
      )
      .map((restaurant) => restaurant.id),
  );
}
