import type { RestaurantWithMenu } from "../../src/data/types";
import { fullInfoMenu, unknownInfoMenu } from "./menu.fixture";

export const restaurantWithFullInfo: RestaurantWithMenu = {
  id: "rest-full-info",
  name: "Le Restaurant Complet",
  slug: "le-restaurant-complet",
  address: "1 rue de Test",
  postalCode: "75001",
  city: "Paris",
  latitude: 48.8566,
  longitude: 2.3522,
  cuisineTypes: ["Française"],
  vegetarianOptions: true,
  veganOptions: false,
  allergenInformationAvailable: true,
  isDemoData: true,
  menuId: "menu-full-info",
  menu: fullInfoMenu,
};

export const restaurantWithoutAllergenInfo: RestaurantWithMenu = {
  id: "rest-no-info",
  name: "Le Bistrot Sans Info",
  slug: "le-bistrot-sans-info",
  address: "2 rue de Test",
  postalCode: "75002",
  city: "Paris",
  latitude: 48.86,
  longitude: 2.34,
  cuisineTypes: ["Française"],
  vegetarianOptions: false,
  veganOptions: false,
  allergenInformationAvailable: false,
  isDemoData: true,
};

export const restaurantWithUnknownInfo: RestaurantWithMenu = {
  id: "rest-unknown-info",
  name: "Le Mystère",
  slug: "le-mystere",
  address: "3 rue de Test",
  postalCode: "75003",
  city: "Paris",
  latitude: 48.87,
  longitude: 2.35,
  cuisineTypes: ["Fusion"],
  vegetarianOptions: true,
  veganOptions: true,
  allergenInformationAvailable: true,
  isDemoData: true,
  menuId: "menu-unknown-info",
  menu: unknownInfoMenu,
};

export const allFixtureRestaurants: RestaurantWithMenu[] = [
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
  restaurantWithUnknownInfo,
];
