import { describe, expect, it } from "vitest";
import { sortModulesByStartDate } from "./sort-modules-by-start-date";

describe("sortModulesByStartDate", () => {
  it("sorts modules by ascending start date without mutating the input", () => {
    const modules = [
      { id: 1, minDate: "2026-08-20" },
      { id: 2, minDate: "2026-08-01" },
      { id: 3, minDate: "2026-08-10" },
    ];

    expect(sortModulesByStartDate(modules).map((module) => module.id)).toEqual([
      2, 3, 1,
    ]);
    expect(modules.map((module) => module.id)).toEqual([1, 2, 3]);
  });

  it("keeps modules without a valid start date at the end", () => {
    const modules = [
      { id: 1, minDate: undefined },
      { id: 2, minDate: "2026-08-01" },
      { id: 3, minDate: "invalid-date" },
      { id: 4, minDate: undefined },
    ];

    expect(sortModulesByStartDate(modules).map((module) => module.id)).toEqual([
      2, 1, 3, 4,
    ]);
  });
});
