import type { Restaurant } from "../data/types";

/**
 * L'adresse complète, « 13 rue du Renard, 75004 Paris ». Partout où le site situe un restaurant,
 * à la place de l'arrondissement : elle vaut pour toutes les villes, et le code postal dit le
 * quartier à qui sait le lire.
 */
export const fullAddress = (restaurant: Restaurant) =>
  `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;
