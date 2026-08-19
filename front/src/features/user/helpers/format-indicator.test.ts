import { describe, expect, it } from "vitest";
import {
  formatDays,
  formatDuration,
  formatIndicatorValue,
  indicatorEmptyMessage,
  toDisplayMinutes,
} from "./format-indicator";
import type { Indicator } from "../interfaces/indicators";

describe("formatDuration", () => {
  it("affiche les minutes sous l'heure", () => {
    expect(formatDuration(20 * 60_000)).toBe("20 min");
  });

  it("n'arrondit plus une minute de connexion à une heure", () => {
    // L'ancien calcul front faisait Math.ceil(ms / 3600000).
    expect(formatDuration(60_000)).toBe("1 min");
  });

  it("combine heures et minutes", () => {
    expect(formatDuration(2 * 3_600_000 + 34 * 60_000)).toBe("2 h 34");
  });

  it("omet les minutes nulles", () => {
    expect(formatDuration(3 * 3_600_000)).toBe("3 h");
  });

  it("ne produit pas « 0 h 60 » par arrondi", () => {
    expect(formatDuration(59 * 60_000 + 59_000)).toBe("1 h");
  });

  it("affiche zéro pour une durée nulle", () => {
    expect(formatDuration(0)).toBe("0 min");
  });

  it("affiche au moins une minute pour une durée non nulle", () => {
    expect(formatDuration(5_000)).toBe("1 min");
  });
});

describe("formatDays", () => {
  it("nomme les deux premiers jours", () => {
    expect(formatDays(0)).toBe("aujourd'hui");
    expect(formatDays(1)).toBe("hier");
  });

  it("compte au-delà", () => {
    expect(formatDays(12)).toBe("il y a 12 jours");
  });
});

describe("formatIndicatorValue", () => {
  it("rend un tiret quand la valeur est absente", () => {
    expect(formatIndicatorValue(null, "count")).toBe("—");
  });

  it("suffixe les pourcentages", () => {
    expect(formatIndicatorValue(72, "percent")).toBe("72 %");
  });

  it("signe les tendances", () => {
    expect(formatIndicatorValue(8, "trend")).toBe("+8 pts");
    expect(formatIndicatorValue(-8, "trend")).toBe("-8 pts");
    expect(formatIndicatorValue(0, "trend")).toBe("stable");
  });

  it("nomme les niveaux d'humeur", () => {
    expect(formatIndicatorValue(5, "level")).toBe("Au beau fixe");
  });

  it("laisse les compteurs bruts", () => {
    expect(formatIndicatorValue(0, "count")).toBe("0");
  });
});

describe("indicatorEmptyMessage", () => {
  const base: Indicator = {
    key: "mood",
    label: "Humeur",
    value: null,
    available: false,
  };

  it("reprend la raison fournie par l'API", () => {
    expect(
      indicatorEmptyMessage({ ...base, meta: { reason: "Aucun retour." } }),
    ).toBe("Aucun retour.");
  });

  it("signale un calcul en échec", () => {
    expect(
      indicatorEmptyMessage({ ...base, meta: { error: "timeout" } }),
    ).toBe("Calcul indisponible : timeout");
  });

  it("retombe sur un message générique", () => {
    expect(indicatorEmptyMessage(base)).toBe("Pas encore de donnée.");
  });
});

describe("toDisplayMinutes", () => {
  it("garde zéro pour une durée nulle", () => {
    expect(toDisplayMinutes(0)).toBe(0);
  });

  it("plancher à une minute, comme la carte correspondante", () => {
    // Sans ce plancher, la carte affiche « 1 min » et la barre reste à zéro.
    expect(toDisplayMinutes(12_436)).toBe(1);
  });

  it("arrondit au-delà", () => {
    expect(toDisplayMinutes(150_000)).toBe(3);
  });
});
