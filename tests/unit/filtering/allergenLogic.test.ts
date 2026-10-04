import { describe, expect, it } from "vitest";
import {
  assessDishAgainstAvoidance,
  countDishesDeclaringAvoided,
  filterMenuAgainstAvoidance,
} from "../../../src/filtering/allergenLogic";
import {
  fullInfoMenu,
  makeAllergenMap,
  menuWithDrinks,
  unknownInfoMenu,
} from "../../fixtures/menu.fixture";

describe("assessDishAgainstAvoidance", () => {
  it("returns no_allergens_selected when the avoid list is empty", () => {
    expect(assessDishAgainstAvoidance(makeAllergenMap(), [])).toBe("no_allergens_selected");
  });

  it("returns contains_avoided when the avoided allergen is present", () => {
    const allergens = makeAllergenMap({ gluten: "present" });
    expect(assessDishAgainstAvoidance(allergens, ["gluten"])).toBe("contains_avoided");
  });

  it("returns may_contain_avoided when only traces are declared", () => {
    const allergens = makeAllergenMap({ gluten: "may_contain" });
    expect(assessDishAgainstAvoidance(allergens, ["gluten"])).toBe("may_contain_avoided");
  });

  it("returns incomplete_info_for_avoided when the document doesn't cover the allergen", () => {
    expect(assessDishAgainstAvoidance(makeAllergenMap({ gluten: "unknown" }), ["gluten"])).toBe(
      "incomplete_info_for_avoided",
    );
  });

  it("returns not_declared_for_avoided when the document is silent — a report, not an all-clear", () => {
    expect(
      assessDishAgainstAvoidance(makeAllergenMap({ gluten: "not_declared" }), ["gluten"]),
    ).toBe("not_declared_for_avoided");
  });

  it("lets an unknown avoided allergen outweigh a silent one", () => {
    const allergens = makeAllergenMap({ gluten: "not_declared", lupin: "unknown" });
    expect(assessDishAgainstAvoidance(allergens, ["gluten", "lupin"])).toBe(
      "incomplete_info_for_avoided",
    );
  });

  it("prioritizes the worst status across multiple avoided allergens", () => {
    const allergens = makeAllergenMap({ gluten: "may_contain", lait: "present" });
    expect(assessDishAgainstAvoidance(allergens, ["gluten", "lait"])).toBe("contains_avoided");
  });
});

describe("countDishesDeclaringAvoided", () => {
  it("counts the drinks apart from the dishes", () => {
    expect(countDishesDeclaringAvoided(menuWithDrinks, ["gluten"])).toEqual({
      dishes: { declaring: 1, traces: 0, unknown: 0, total: 2 },
      drinks: { declaring: 1, traces: 0, unknown: 0, total: 2 },
    });
  });

  it("counts traces and uncovered dishes apart from the declaring ones", () => {
    // fullInfoMenu: "Plat au blé" declares traces of milk; unknownInfoMenu covers nothing.
    expect(countDishesDeclaringAvoided(fullInfoMenu, ["lait"]).dishes).toEqual({
      declaring: 0,
      traces: 1,
      unknown: 0,
      total: 2,
    });
    expect(countDishesDeclaringAvoided(unknownInfoMenu, ["gluten"]).dishes).toEqual({
      declaring: 0,
      traces: 0,
      unknown: 1,
      total: 1,
    });
  });

  it("counts traces as declaring when the visitor excludes them", () => {
    expect(
      countDishesDeclaringAvoided(fullInfoMenu, ["lait"], { excludeTraces: true }).dishes,
    ).toEqual({ declaring: 1, traces: 0, unknown: 0, total: 2 });
  });

  it("returns zero totals when there is no menu", () => {
    expect(countDishesDeclaringAvoided(undefined, ["gluten"])).toEqual({
      dishes: { declaring: 0, traces: 0, unknown: 0, total: 0 },
      drinks: { declaring: 0, traces: 0, unknown: 0, total: 0 },
    });
  });
});

describe("filterMenuAgainstAvoidance", () => {
  it("counts hidden drinks apart from hidden dishes", () => {
    const result = filterMenuAgainstAvoidance(menuWithDrinks, ["gluten"]);
    expect(result.excludedDishCount).toBe(1);
    expect(result.excludedDrinkCount).toBe(1);
  });

  it("returns the menu untouched when no allergens are selected", () => {
    const result = filterMenuAgainstAvoidance(fullInfoMenu, []);
    expect(result.categories).toEqual(fullInfoMenu.categories);
    expect(result.excludedDishCount).toBe(0);
  });

  it("removes only dishes with a confirmed 'present' match, and counts them", () => {
    const result = filterMenuAgainstAvoidance(fullInfoMenu, ["gluten"]);
    const names = result.categories.flatMap((c) => c.dishes.map((d) => d.name));
    expect(names).not.toContain("Plat au blé");
    expect(names).toContain("Salade simple");
    expect(result.excludedDishCount).toBe(1);
  });

  it("keeps 'may_contain' dishes visible rather than implying the rest are safe", () => {
    const result = filterMenuAgainstAvoidance(fullInfoMenu, ["lait"]);
    const names = result.categories.flatMap((c) => c.dishes.map((d) => d.name));
    expect(names).toContain("Plat au blé"); // lait is may_contain here
    expect(result.excludedDishCount).toBe(0);
  });

  it("hides 'may_contain' dishes too when the visitor excludes traces", () => {
    const result = filterMenuAgainstAvoidance(fullInfoMenu, ["lait"], { excludeTraces: true });
    const names = result.categories.flatMap((c) => c.dishes.map((d) => d.name));
    expect(names).toEqual(["Salade simple"]);
    expect(result.excludedDishCount).toBe(1);
  });

  it("keeps dishes whose information is entirely unknown — absence of data is never an all-clear", () => {
    const result = filterMenuAgainstAvoidance(unknownInfoMenu, ["gluten"]);
    const names = result.categories.flatMap((c) => c.dishes.map((d) => d.name));
    expect(names).toContain("Plat mystère");
    expect(result.excludedDishCount).toBe(0);
  });

  it("drops a category once all of its dishes are excluded", () => {
    const result = filterMenuAgainstAvoidance(fullInfoMenu, ["gluten", "lait"]);
    // "Plat au blé" has gluten present; "Salade simple" declares neither, so it stays.
    expect(result.categories).toHaveLength(1);
    expect(result.categories[0]?.dishes.map((d) => d.name)).toEqual(["Salade simple"]);
  });

  it("does not mutate the menu it was given", () => {
    const before = JSON.stringify(fullInfoMenu);
    filterMenuAgainstAvoidance(fullInfoMenu, ["gluten"]);
    expect(JSON.stringify(fullInfoMenu)).toBe(before);
  });
});
