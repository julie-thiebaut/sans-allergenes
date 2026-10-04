/**
 * Les cartes ne marquent pas leurs boissons : seul le nom de la rubrique le dit (« Boissons
 * fraîches », « BIÈRES », « Carte des vins - Bordeaux rouge »…). Les compter comme des plats
 * fausse « 4 plats sur 18 » dès qu'une carte aligne ses sodas et ses vins, et peut garder en
 * liste un restaurant où l'on ne peut rien manger, seulement boire de l'eau.
 *
 * Un mot de boisson dans le nom suffit, sauf quand un mot de plat l'emporte (« Café ou Thé
 * Gourmand » sert des mignardises, « BRUNCH & COFFEE SHOP » des toasts, « Toasts et smoothie
 * bowls » des bols à la cuillère). Les rubriques que leur
 * nom ne trahit pas — une marque, un intitulé maison — sont nommées carte par carte.
 */
const DRINK_WORDS = [
  "boissons?",
  "drinks?",
  "bi[eè]res?",
  "beers?",
  "vins?",
  "wines?",
  "cave",
  "champagnes?",
  "bulles",
  "cidres?",
  "sak[eé]",
  "ap[eé]ritifs?",
  "digestifs?",
  "spiritueux",
  "cocktails?",
  "mocktails?",
  "spritz",
  "shots?",
  "softs?",
  "eaux?",
  "waters?",
  "jus",
  "juices?",
  "smoothies?",
  "nutmylks?",
  "milkshakes?",
  "shakes?",
  "slushys?",
  "frapp[eé]s",
  "iced",
  "caf[eé]s?",
  "caf[eé]t[eé]rie",
  "coffee",
  "espressos?",
  "lattes?",
  "chocolats? chauds?",
  // « thé » s'écrit avec son accent : sans lui, c'est l'article anglais de « The Classics ».
  "thés?",
  "tea",
  "cha[iï]",
  "matcha",
];

const DRINK_PATTERN = new RegExp(
  `(?<![\\p{L}\\p{N}])(?:${DRINK_WORDS.join("|")})(?![\\p{L}\\p{N}])`,
  "u",
);
const FOOD_PATTERN = /(?<![\p{L}\p{N}])(?:brunch|gourmands?|bowls?)(?![\p{L}\p{N}])/u;

const DRINK_CATEGORIES_BY_MENU: Record<string, readonly string[]> = {
  "menu-chant-des-voyelles": ["Happy Hours · 16h-21h"],
  // Chez Sarawan, « Classiques » sert du riz et des nouilles.
  "menu-french-coffee-shop": ["Classiques"],
  "menu-nako": ["Mangajo", "Maya"],
};

export function isDrinkCategory(menuId: string, category: string): boolean {
  if (DRINK_CATEGORIES_BY_MENU[menuId]?.includes(category)) return true;
  const name = category.normalize("NFC").toLowerCase();
  return DRINK_PATTERN.test(name) && !FOOD_PATTERN.test(name);
}
