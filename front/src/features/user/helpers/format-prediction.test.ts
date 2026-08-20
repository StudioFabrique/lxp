import { describe, expect, it } from "vitest";
import {
  alertBadgeClass,
  formatAlertLevel,
  formatAlertRuleDescription,
  formatAlertRuleName,
  formatModelIndicatorValue,
  formatOutcome,
  formatProbability,
  sortedProbabilities,
} from "./format-prediction";

describe("formatOutcome", () => {
  it("traduit le vocabulaire du modèle", () => {
    expect(formatOutcome("dropout")).toBe("Abandon probable");
  });

  it("laisse passer une issue inconnue plutôt que de l'effacer", () => {
    expect(formatOutcome("inconnu")).toBe("inconnu");
  });
});

describe("formatAlertLevel", () => {
  it("nomme l'absence d'alerte", () => {
    expect(formatAlertLevel(0)).toBe("Aucune alerte");
  });

  it("distingue le niveau le plus grave", () => {
    expect(formatAlertLevel(3)).toBe("Alerte critique");
    expect(alertBadgeClass(3)).toBe("badge-error");
  });
});

describe("formatAlertRuleName", () => {
  it("traduit les règles livrées par défaut avec le service IA", () => {
    expect(formatAlertRuleName("Low connection")).toBe("Connexions rares");
    expect(formatAlertRuleDescription("Low connection", "Moderately low")).toBe(
      "Trois à cinq jours de connexion seulement sur la période.",
    );
  });

  it("laisse passer une règle ajoutée côté service", () => {
    // Les règles sont modifiables en base : une règle inconnue doit rester
    // lisible plutôt que d'être masquée.
    expect(formatAlertRuleName("Règle maison")).toBe("Règle maison");
    expect(formatAlertRuleDescription("Règle maison", "Seuil interne")).toBe(
      "Seuil interne",
    );
  });
});

describe("formatProbability", () => {
  it("affiche une probabilité en pourcentage entier", () => {
    expect(formatProbability(0.4798)).toBe("48 %");
  });
});

describe("formatModelIndicatorValue", () => {
  it("rappelle l'unité des durées transmises au modèle", () => {
    // Le modèle raisonne en minutes, pas en millisecondes comme la plateforme.
    expect(formatModelIndicatorValue("session_time", 90)).toBe("90 min");
  });

  it("remet le taux de réussite sur une échelle lisible", () => {
    expect(formatModelIndicatorValue("pass_rate", 0.75)).toBe("75 %");
  });

  it("ramène la pente du modèle à des points par jour", () => {
    expect(formatModelIndicatorValue("score_evolution", 0.016667)).toBe(
      "+1,67 pt/jour",
    );
    expect(formatModelIndicatorValue("score_evolution", -0.01)).toBe(
      "-1,00 pt/jour",
    );
  });

  it("distingue une variable absente d'une valeur nulle", () => {
    expect(formatModelIndicatorValue("quiz_interaction_count", null)).toBe("—");
    expect(formatModelIndicatorValue("quiz_interaction_count", 0)).toBe("0");
  });
});

describe("sortedProbabilities", () => {
  it("classe les issues de la plus probable à la moins probable", () => {
    const probabilities = { dropout: 0.1, fail: 0.42, graduate: 0.48 };

    expect(
      sortedProbabilities(probabilities).map((item) => item.outcome),
    ).toEqual(["graduate", "fail", "dropout"]);
  });
});
