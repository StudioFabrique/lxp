import { describe, expect, it } from "vitest";
import { formatNumber } from "./format-number";

describe("formatNumber", () => {
  it("separates thousands with a narrow no-break space", () => {
    expect(formatNumber(1234567)).toBe("1 234 567");
    expect(formatNumber(1000)).toBe("1 000");
  });
  it("leaves small numbers untouched", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(999)).toBe("999");
  });
  it("uses a decimal comma", () => {
    expect(formatNumber(1234.5)).toBe("1 234,5");
  });
});

describe("formatNumber with options", () => {
  it("fixes the number of decimals", () => {
    expect(formatNumber(1536.5, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe("1 536,50");
  });
});
