import { RestaurantListSchema, type Restaurant } from "./schemas";

export class DataLoadError extends Error {}

export async function loadRestaurants(fetchImpl: typeof fetch = fetch): Promise<Restaurant[]> {
  const url = `${import.meta.env.BASE_URL}data/restaurants.json`;
  let response: Response;
  try {
    response = await fetchImpl(url);
  } catch (cause) {
    throw new DataLoadError(`Impossible de charger la liste des restaurants (${url})`, { cause });
  }
  if (!response.ok) {
    throw new DataLoadError(`Échec du chargement des restaurants : HTTP ${response.status}`);
  }

  const json: unknown = await response.json();
  const result = RestaurantListSchema.safeParse(json);
  if (!result.success) {
    throw new DataLoadError(`Données restaurants.json invalides : ${result.error.message}`);
  }
  return result.data;
}
