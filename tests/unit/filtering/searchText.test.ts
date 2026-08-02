import { describe, expect, it } from "vitest";
import { normalizeSearchText } from "../../../src/filtering/searchText";

describe("normalizeSearchText", () => {
  it("strips accents and lowercases", () => {
    expect(normalizeSearchText("Café Élégant")).toBe("cafe elegant");
  });
});
