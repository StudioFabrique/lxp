import { emptyIndicator, toDayKey } from "../types.ts";

describe("toDayKey", () => {
  it("réduit une date à sa journée UTC", () => {
    expect(toDayKey(new Date("2026-08-19T23:45:00.000Z"))).toBe("2026-08-19");
  });
});

describe("emptyIndicator", () => {
  it("marque l'indicateur comme indisponible plutôt que nul", () => {
    const indicator = emptyIndicator("mood", "Humeur déclarée", "level", {
      reason: "Aucun retour déposé.",
    });

    // `value: null` et non `0` : l'interface doit pouvoir distinguer
    // « mesuré à zéro » de « pas de donnée ».
    expect(indicator).toEqual({
      key: "mood",
      label: "Humeur déclarée",
      value: null,
      unit: "level",
      available: false,
      meta: { reason: "Aucun retour déposé." },
    });
  });
});
