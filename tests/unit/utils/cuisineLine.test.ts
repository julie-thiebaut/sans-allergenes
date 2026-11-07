import { describe, expect, it } from "vitest";
import { cuisineLine } from "../../../src/utils/cuisineLine";

function line(
  cuisineTypes: string[],
  vegetarianOptions: boolean,
  veganOptions: boolean,
  meatOptions = false,
) {
  return cuisineLine({ cuisineTypes, vegetarianOptions, veganOptions, meatOptions });
}

describe("cuisineLine", () => {
  it("adds the vegetarian dishes after the types", () => {
    expect(line(["Burgers", "Fast-food"], true, false)).toBe(
      "Burgers, Fast-food · plats végétariens disponibles",
    );
  });

  it("names only the vegan dishes, which say more", () => {
    expect(line(["Healthy", "Salades"], true, true)).toBe(
      "Healthy, Salades · plats végétaliens disponibles",
    );
  });

  it("names the meat dishes alone", () => {
    expect(line(["Française"], false, false, true)).toBe("Française · plats carnés disponibles");
  });

  it("puts the plant-based and meat dishes in one mention", () => {
    expect(line(["Burgers"], true, false, true)).toBe(
      "Burgers · plats végétariens et carnés disponibles",
    );
    expect(line(["Healthy"], true, true, true)).toBe(
      "Healthy · plats végétaliens et carnés disponibles",
    );
  });

  it("starts the line with the mention when there are no types", () => {
    expect(line([], false, false, true)).toBe("Plats carnés disponibles");
  });

  it("leaves the types alone when there are no such dishes", () => {
    expect(line(["Française"], false, false)).toBe("Française");
  });

  it("doesn't repeat what a type already says", () => {
    expect(line(["Boulangerie", "Café", "Végan"], true, true)).toBe("Boulangerie, Café, Végan");
    expect(line(["Burgers", "Végétarien"], true, false)).toBe("Burgers, Végétarien");
    expect(line(["Jus & smoothies", "Végan"], true, false)).toBe("Jus & smoothies, Végan");
  });

  it("still names vegan dishes after a vegetarian type", () => {
    expect(line(["Végétarien", "Indienne"], true, true)).toBe(
      "Végétarien, Indienne · plats végétaliens disponibles",
    );
  });
});
