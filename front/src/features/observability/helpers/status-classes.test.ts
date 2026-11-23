import { describe, expect, it } from "vitest";
import { groupStatusByClass } from "./status-classes";

describe("regroupement des codes HTTP", () => {
  it("additionne les codes d'une même famille", () => {
    const grouped = groupStatusByClass([
      { status: "200", count: 10 },
      { status: "201", count: 5 },
      { status: "304", count: 2 },
      { status: "404", count: 3 },
      { status: "500", count: 1 },
    ]);
    expect(grouped.map(({ key, count }) => [key, count])).toEqual([
      ["success", 15],
      ["redirect", 2],
      ["client", 3],
      ["server", 1],
    ]);
  });

  it("ignore les codes inconnus et garde les quatre familles à zéro", () => {
    const grouped = groupStatusByClass([
      { status: "", count: 4 },
      { status: "999", count: 4 },
    ]);
    expect(grouped).toHaveLength(4);
    expect(grouped.every(({ count }) => count === 0)).toBe(true);
  });
});
