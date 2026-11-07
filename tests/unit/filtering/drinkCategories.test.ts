import { describe, expect, it } from "vitest";
import { isDrinkCategory } from "../../../src/filtering/drinkCategories";

describe("isDrinkCategory", () => {
  it.each([
    "Boissons fraîches",
    "BIÈRES",
    "BIERES & CO",
    "Carte des vins - Bordeaux rouge",
    "Les nectars et jus de fruits",
    "Thés bio",
    "THÉ",
    "Bubble tea 500ml",
    "ICED CHAÏ",
    "Iced Signatures",
    "Caféterie",
    "Chocolats Chauds et Glacés",
    "SPIRITUEUX - Whiskies",
    "Saké",
    "L'eau de source",
  ])("recognises « %s » as drinks", (category) => {
    expect(isDrinkCategory("menu-any", category)).toBe(true);
  });

  it.each([
    "Desserts",
    "Burgers",
    // The English article is not « thé ».
    "From the Griddle",
    "The Classics",
    // A drink word has to start a word: « eaux » is not in « beaux ».
    "Les beaux plats",
    // A food word wins over a drink word.
    "Café ou Thé Gourmand",
    "BRUNCH & COFFEE SHOP",
    "Toasts et smoothie bowls",
    "CICCHETTI APERITIVI",
  ])("keeps « %s » as dishes", (category) => {
    expect(isDrinkCategory("menu-any", category)).toBe(false);
  });

  it("reads a category whose name says nothing as drinks only on the menu it is named for", () => {
    expect(isDrinkCategory("menu-nako", "Mangajo")).toBe(true);
    expect(isDrinkCategory("menu-french-coffee-shop", "Classiques")).toBe(true);
    expect(isDrinkCategory("menu-sarawan", "Classiques")).toBe(false);
  });
});
