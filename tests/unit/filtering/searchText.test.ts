import { describe, expect, it } from "vitest";
import { matchesSearchText, normalizeSearchText } from "../../../src/filtering/searchText";
import { restaurantWithFullInfo } from "../../fixtures/restaurants.fixture";

describe("normalizeSearchText", () => {
  it("strips accents and lowercases", () => {
    expect(normalizeSearchText("Café Élégant")).toBe("cafe elegant");
  });
});

describe("matchesSearchText", () => {
  it("matches on name regardless of accents/case", () => {
    expect(matchesSearchText(restaurantWithFullInfo, "restaurant")).toBe(true);
    expect(matchesSearchText(restaurantWithFullInfo, "COMPLET")).toBe(true);
  });

  it("matches on cuisine type, accent-insensitively", () => {
    expect(matchesSearchText(restaurantWithFullInfo, "francaise")).toBe(true);
  });

  it("returns true for an empty query", () => {
    expect(matchesSearchText(restaurantWithFullInfo, "")).toBe(true);
  });

  it("returns false when nothing matches", () => {
    expect(matchesSearchText(restaurantWithFullInfo, "sushi introuvable")).toBe(false);
  });
});
