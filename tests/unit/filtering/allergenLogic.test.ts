import { describe, expect, it } from "vitest";
import {
  assessDishAgainstAvoidance,
  assessMenuAgainstAvoidance,
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
