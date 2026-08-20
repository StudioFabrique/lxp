import { describe, expect, it } from "vitest";
import {
  formatAlertRuleDescription,
  formatAlertRuleName,
  formatMatchedCondition,
  formatModelIndicatorValue,
  formatOutcome,
  formatProbability,
  formatRiskLevel,
  isUncertain,
  missingDataSentence,
  riskLevel,
  severityBadgeClass,
  sortedProbabilities,
} from "./format-prediction";
import type { IndicatorsPrediction } from "../interfaces/indicators";

function prediction(
  overrides: Partial<IndicatorsPrediction> = {},
): IndicatorsPrediction {
  return {
    userId: "abc",
    from: "2026-07-21T00:00:00.000Z",
    to: "2026-08-20T00:00:00.000Z",
    indicators: {},
    missing: {},
    coverage: { available: 11, total: 11 },
    outcome: {
      prediction: "graduate",
      probabilities: { dropout: 0.1, fail: 0.2, graduate: 0.7 },
    },
    alert: { effectiveLevel: 0, fired: [] },
    model: {
      championName: null,
      trainedAt: null,
      metricValue: null,
      featureCount: null,
    },
    evaluatedAt: "2026-08-20T00:00:00.000Z",
    ...overrides,
  };
}

describe("formatOutcome", () => {
  it("traduit le vocabulaire du modèle", () => {
    expect(formatOutcome("dropout")).toBe("Abandon");
  });

  it("laisse passer une issue inconnue plutôt que de l'effacer", () => {
    expect(formatOutcome("inconnu")).toBe("inconnu");
  });
});

describe("riskLevel", () => {
  it("retient le signal le plus grave des deux", () => {
    // Le modèle voit l'apprenant finir son parcours, mais une règle de niveau 2
    // s'est déclenchée : c'est elle qui commande.
    expect(
      riskLevel(prediction({ alert: { effectiveLevel: 2, fired: [] } })),
    ).toBe(2);
  });

  it("relève le niveau quand l'issue estimée est un abandon", () => {
    expect(
      riskLevel(
        prediction({
          outcome: {
            prediction: "dropout",
            probabilities: { dropout: 0.8, fail: 0.1, graduate: 0.1 },
          },
        }),
      ),
    ).toBe(3);
  });

  it("ne signale rien quand aucun des deux signaux n'alerte", () => {
    expect(riskLevel(prediction())).toBe(0);
    expect(formatRiskLevel(0)).toBe("Rien à signaler");
    expect(severityBadgeClass(0)).toBe("badge-success");
  });
});

describe("isUncertain", () => {
  it("signale une distribution sans issue dominante", () => {
    expect(isUncertain({ dropout: 0.1, fail: 0.42, graduate: 0.48 })).toBe(true);
  });

  it("ne signale rien quand une issue l'emporte", () => {
    expect(isUncertain({ dropout: 0.1, fail: 0.2, graduate: 0.7 })).toBe(false);
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

describe("formatMatchedCondition", () => {
  it("met la valeur et le seuil dans la même unité", () => {
    expect(
      formatMatchedCondition({
        indicator: "pass_rate",
        op: "<",
        threshold: 0.6,
        actual: 0.5,
      }),
    ).toBe("Taux de réussite aux quiz : 50 % (seuil : en dessous de 60 %)");
  });

  it("dit le seuil sans opérateur mathématique", () => {
    expect(
      formatMatchedCondition({
        indicator: "monthly_connection_days",
        op: ">",
        threshold: 2,
        actual: 4,
      }),
    ).toBe("Jours de connexion : 4 jours (seuil : au-dessus de 2 jours)");
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

describe("missingDataSentence", () => {
  it("ne dit rien quand l'analyse est complète", () => {
    expect(missingDataSentence(prediction())).toBeNull();
  });

  it("nomme les données absentes plutôt que d'en donner le compte", () => {
    expect(
      missingDataSentence(
        prediction({
          missing: {
            time_on_content: "Aucune consultation mesurée.",
            mood_proxy: "Aucun retour déposé.",
          },
        }),
      ),
    ).toBe(
      "2 données manquaient : temps passé sur les contenus, humeur déclarée.",
    );
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
