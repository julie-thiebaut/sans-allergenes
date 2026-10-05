import { describe, expect, it } from "vitest";
import { cuisineLine } from "../../../src/utils/cuisineLine";

function line(cuisineTypes: string[], vegetarianOptions: boolean, veganOptions: boolean) {
  return cuisineLine({ cuisineTypes, vegetarianOptions, veganOptions });
}

describe("cuisineLine", () => {
  it("adds the vegetarian options after the types", () => {
    expect(line(["Burgers", "Fast-food"], true, false)).toBe(
      "Burgers, Fast-food · options végétariennes",
    );
  });

  it("names only the vegan options, which say more", () => {
    expect(line(["Healthy", "Salades"], true, true)).toBe("Healthy, Salades · options véganes");
  });

  it("leaves the types alone when there are no such options", () => {
    expect(line(["Française"], false, false)).toBe("Française");
  });

  it("doesn't repeat what a type already says", () => {
    expect(line(["Boulangerie", "Café", "Végan"], true, true)).toBe("Boulangerie, Café, Végan");
    expect(line(["Burgers", "Végétarien"], true, false)).toBe("Burgers, Végétarien");
    expect(line(["Jus & smoothies", "Végan"], true, false)).toBe("Jus & smoothies, Végan");
  });

  it("still names vegan options after a vegetarian type", () => {
    expect(line(["Végétarien", "Indienne"], true, true)).toBe(
      "Végétarien, Indienne · options véganes",
    );
  });
});
