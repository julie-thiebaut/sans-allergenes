import { describe, expect, it } from "vitest";
import { formatMonthYear, formatVerifiedDate } from "../../../src/utils/formatDate";

describe("formatVerifiedDate", () => {
  it("writes the date in French", () => {
    expect(formatVerifiedDate("2026-09-10")).toBe("10 septembre 2026");
  });

  it("gives back what it cannot read", () => {
    expect(formatVerifiedDate("pas une date")).toBe("pas une date");
  });
});

describe("formatMonthYear", () => {
  it("writes the month and year in French, the first of the month included", () => {
    expect(formatMonthYear("2026-10-01")).toBe("octobre 2026");
  });

  it("gives back what it cannot read", () => {
    expect(formatMonthYear("pas une date")).toBe("pas une date");
  });
});
