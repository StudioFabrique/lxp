import { describe, expect, it } from "vitest";
import { groupActionsByDay } from "./group-actions-by-day";

const at = (day: number, hour: number) => ({
  time: new Date(2026, 10, day, hour).toISOString(),
});

describe("regroupement des actions par jour", () => {
  const now = new Date(2026, 10, 23, 16);

  it("nomme aujourd'hui et hier, puis date les jours plus anciens", () => {
    const groups = groupActionsByDay([at(23, 15), at(23, 9), at(22, 20), at(20, 10)], now);
    expect(groups.map(({ label }) => label).slice(0, 2)).toEqual(["Aujourd'hui", "Hier"]);
    expect(groups[2].label).toContain("2026");
    expect(groups.map(({ actions }) => actions.length)).toEqual([2, 1, 1]);
  });

  it("conserve l'ordre reçu et ignore les dates invalides", () => {
    const groups = groupActionsByDay([at(23, 15), { time: "n'importe quoi" }, at(23, 9)], now);
    expect(groups).toHaveLength(1);
    expect(groups[0].actions).toHaveLength(2);
  });

  it("renvoie une liste vide sans événement", () => {
    expect(groupActionsByDay([], now)).toEqual([]);
  });
});
