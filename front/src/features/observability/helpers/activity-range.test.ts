import { describe, expect, it } from "vitest";
import {
  customRangeLabel,
  presetRange,
  rangeKey,
  rangeParams,
} from "./activity-range";

describe("fenêtre d'analyse", () => {
  it("transmet une période prédéfinie telle quelle", () => {
    expect(rangeParams(presetRange("7d"))).toEqual({ period: "7d" });
    expect(rangeKey(presetRange("7d"))).toBe("7d");
  });

  it("convertit un intervalle en bornes [début du premier jour, début du lendemain du dernier[", () => {
    const params = rangeParams({ kind: "custom", startDate: "2026-11-10", endDate: "2026-11-12" });
    expect(new Date(params.from).getTime()).toBe(new Date(2026, 10, 10).getTime());
    expect(new Date(params.to).getTime()).toBe(new Date(2026, 10, 13).getTime());
    expect(Object.keys(params).sort()).toEqual(["from", "to"]);
  });

  it("gère un changement de mois et d'année dans la borne de fin", () => {
    const params = rangeParams({ kind: "custom", startDate: "2026-12-31", endDate: "2026-12-31" });
    expect(new Date(params.to).getTime()).toBe(new Date(2027, 0, 1).getTime());
  });

  it("distingue les intervalles dans la clé de cache", () => {
    const a = rangeKey({ kind: "custom", startDate: "2026-11-01", endDate: "2026-11-02" });
    const b = rangeKey({ kind: "custom", startDate: "2026-11-01", endDate: "2026-11-03" });
    expect(a).not.toBe(b);
    expect(a).not.toBe(rangeKey(presetRange("24h")));
  });

  it("écrit le libellé du bouton sans séparateur typographique", () => {
    expect(customRangeLabel("2026-11-10", "2026-11-12")).toMatch(/^Du .+ au .+$/);
    expect(customRangeLabel("2026-11-10", "2026-11-10")).not.toContain("Du");
  });
});
