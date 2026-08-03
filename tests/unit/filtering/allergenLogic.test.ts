import { describe, expect, it } from "vitest";
import {
  assessDishAgainstAvoidance,
  assessMenuAgainstAvoidance,
  filterMenuAgainstAvoidance,
} from "../../../src/filtering/allergenLogic";
import { fullInfoMenu, makeAllergenMap, unknownInfoMenu } from "../../fixtures/menu.fixture";

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

  it("returns incomplete_info_for_avoided for unknown/not_declared — never a safe outcome", () => {
    expect(assessDishAgainstAvoidance(makeAllergenMap({ gluten: "unknown" }), ["gluten"])).toBe(
      "incomplete_info_for_avoided",
    );
    expect(
      assessDishAgainstAvoidance(makeAllergenMap({ gluten: "not_declared" }), ["gluten"]),
    ).toBe("incomplete_info_for_avoided");
  });

  it("never produces an outcome outside the three non-safe possibilities once an allergen is selected", () => {
    const allStatuses = ["present", "may_contain", "not_declared", "unknown"] as const;
    for (const status of allStatuses) {
      const result = assessDishAgainstAvoidance(makeAllergenMap({ gluten: status }), ["gluten"]);
      expect(["contains_avoided", "may_contain_avoided", "incomplete_info_for_avoided"]).toContain(
        result,
      );
    }
  });

  it("prioritizes the worst status across multiple avoided allergens", () => {
    const allergens = makeAllergenMap({ gluten: "may_contain", lait: "present" });
    expect(assessDishAgainstAvoidance(allergens, ["gluten", "lait"])).toBe("contains_avoided");
  });
});

describe("assessMenuAgainstAvoidance", () => {
  it("returns no_allergens_selected when the avoid list is empty", () => {
    expect(assessMenuAgainstAvoidance(fullInfoMenu, [])).toBe("no_allergens_selected");
  });

  it("treats a missing menu as incomplete info, never as an all-clear", () => {
    expect(assessMenuAgainstAvoidance(undefined, ["gluten"])).toBe("incomplete_info_for_avoided");
  });

  it("returns contains_avoided if any dish in the menu has a confirmed match", () => {
    expect(assessMenuAgainstAvoidance(fullInfoMenu, ["gluten"])).toBe("contains_avoided");
  });

  it("returns incomplete_info_for_avoided for a menu where every allergen is unknown", () => {
    expect(assessMenuAgainstAvoidance(unknownInfoMenu, ["gluten"])).toBe(
      "incomplete_info_for_avoided",
    );
  });
});

describe("filterMenuAgainstAvoidance", () => {
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
