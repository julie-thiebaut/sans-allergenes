import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RestaurantListSchema } from "../../../src/data/schemas";
import { CUISINE_TYPES_EN } from "../../../src/i18n/cuisineTypesEn";
import { localizeText } from "../../../src/i18n/contentTranslation";
import { equivalentPath, localeFromPathname, PAGE_PATHS } from "../../../src/i18n/locale";
import { en } from "../../../src/i18n/messages/en";
import { fr } from "../../../src/i18n/messages/fr";

describe("localeFromPathname", () => {
  it("reads English under /en/ only", () => {
    expect(localeFromPathname("/en/")).toBe("en");
    expect(localeFromPathname("/en")).toBe("en");
    expect(localeFromPathname("/en/restaurant/cojean-opera/")).toBe("en");
    expect(localeFromPathname("/")).toBe("fr");
    expect(localeFromPathname("/carte/")).toBe("fr");
    // A French slug that happens to start with "en" stays French.
    expect(localeFromPathname("/restaurant/en-vrac/")).toBe("fr");
    expect(localeFromPathname("/entree/")).toBe("fr");
  });
});

describe("equivalentPath", () => {
  it("maps every page to its counterpart, both ways", () => {
    for (const paths of Object.values(PAGE_PATHS)) {
      expect(equivalentPath(paths.fr, "en")).toBe(paths.en);
      expect(equivalentPath(paths.en, "fr")).toBe(paths.fr);
    }
  });

  it("keeps a restaurant's slug", () => {
    expect(equivalentPath("/restaurant/cojean-opera/", "en")).toBe("/en/restaurant/cojean-opera/");
    expect(equivalentPath("/en/restaurant/cojean-opera", "fr")).toBe("/restaurant/cojean-opera/");
  });

  it("falls back to the other home page for an unknown address", () => {
    expect(equivalentPath("/nulle-part/", "en")).toBe("/en/");
  });
});

describe("localizeText", () => {
  const table = { "Bonjour.": "Hello." };

  it("gives the translation on an English page", () => {
    expect(localizeText("Bonjour.", "en", table)).toEqual({ text: "Hello.", lang: "en" });
  });

  it("keeps the current French text, marked as French, when there is no translation for it", () => {
    expect(localizeText("Bonjour !", "en", table)).toEqual({ text: "Bonjour !", lang: "fr" });
    expect(localizeText("Bonjour.", "en", undefined)).toEqual({ text: "Bonjour.", lang: "fr" });
  });

  it("never translates on a French page", () => {
    expect(localizeText("Bonjour.", "fr", table)).toEqual({ text: "Bonjour.", lang: "fr" });
  });
});

describe("English messages", () => {
  // The same wording rule as in French: what a restaurant declared, never what a dish contains.
  it("never promise that a dish is free of an allergen", () => {
    const strings: string[] = [];
    const collect = (value: unknown): void => {
      if (typeof value === "string") strings.push(value);
      else if (typeof value === "function") {
        for (const args of [
          [true, true],
          [false, false],
          [2, 5, false, true],
          [1, 5, true, false],
        ]) {
          try {
            const result: unknown = (value as (...a: unknown[]) => unknown)(...args);
            if (typeof result === "string") strings.push(result);
          } catch {
            // A function that takes other arguments (a list): its strings are covered below.
          }
        }
      } else if (value && typeof value === "object") Object.values(value).forEach(collect);
    };
    collect(en);
    strings.push(en.cuisine.dietMention([en.cuisine.vegan, en.cuisine.meat]));
    for (const text of strings) {
      expect(text).not.toMatch(/\b(safe|allergen-free|free from|risk-free)\b/i);
    }
  });

  it("name the 14 allergens", () => {
    expect(Object.keys(en.allergens).sort()).toEqual(Object.keys(fr.allergens).sort());
  });
});

describe("CUISINE_TYPES_EN", () => {
  it("has an English label for every type in the catalogue", () => {
    const catalogue = RestaurantListSchema.parse(
      JSON.parse(
        readFileSync(path.resolve(__dirname, "../../../public/data/restaurants.json"), "utf-8"),
      ),
    );
    const missing = [...new Set(catalogue.flatMap((restaurant) => restaurant.cuisineTypes))].filter(
      (type) => !CUISINE_TYPES_EN.has(type),
    );
    expect(missing).toEqual([]);
  });
});
