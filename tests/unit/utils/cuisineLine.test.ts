import { describe, expect, it } from "vitest";
import { cuisineLabels, cuisineLine } from "../../../src/utils/cuisineLine";

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
    expect(line(["Française"], false, false, true)).toBe("Français · plats carnés disponibles");
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
    expect(line(["Bistrot"], false, false)).toBe("Bistrot");
  });

  it("doesn't repeat what a type already says", () => {
    expect(line(["Boulangerie", "Café", "Végan"], true, true)).toBe("Boulangerie, Café, Végan");
    expect(line(["Burgers", "Végétarien"], true, false)).toBe("Burgers, Végétarien");
    expect(line(["Jus & smoothies", "Végan"], true, false)).toBe("Jus & smoothies, Végan");
  });

  it("still names vegan dishes after a vegetarian type", () => {
    expect(line(["Végétarien", "Indienne"], true, true)).toBe(
      "Végétarien, Indien · plats végétaliens disponibles",
    );
  });
});

describe("cuisineLabels", () => {
  it("puts the origins in the masculine", () => {
    expect(cuisineLabels(["Bistrot", "Française"])).toBe("Bistrot, Français");
    expect(cuisineLabels(["Café", "Finlandaise"])).toBe("Café, Finlandais");
    expect(cuisineLabels(["Kebab", "Turque"])).toBe("Kebab, Turc");
    expect(cuisineLabels(["Grecque"])).toBe("Grec");
  });

  it("names what the restaurant is before its origin, whatever the record's order", () => {
    expect(cuisineLabels(["Française", "Bistrot"])).toBe("Bistrot, Français");
    expect(cuisineLabels(["Pub", "Irlandais"])).toBe("Pub, Irlandais");
    expect(cuisineLabels(["Savoyarde", "Française", "Raclette", "Fondue"])).toBe(
      "Raclette, Fondue, Savoyard, Français",
    );
  });

  it("leaves the other labels as they are", () => {
    expect(cuisineLabels(["Burgers", "Fast-food"])).toBe("Burgers, Fast-food");
    expect(cuisineLabels(["Brasserie", "Gastronomique"])).toBe("Brasserie, Gastronomique");
  });
});
