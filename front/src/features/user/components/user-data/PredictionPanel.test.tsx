import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import PredictionPanel from "./PredictionPanel";
import type { IndicatorsPrediction } from "../../interfaces/indicators";

function prediction(
  overrides: Partial<IndicatorsPrediction> = {},
): IndicatorsPrediction {
  return {
    userId: "abc",
    from: "2026-07-21T00:00:00.000Z",
    to: "2026-08-20T00:00:00.000Z",
    indicators: { monthly_connection_days: 4, time_on_content: null },
    missing: { time_on_content: "Aucune consultation mesurée sur la période." },
    coverage: { available: 10, total: 11 },
    outcome: {
      prediction: "graduate",
      probabilities: { dropout: 0.01, fail: 0.02, graduate: 0.97 },
    },
    alert: { effectiveLevel: 0, fired: [] },
    model: {
      championName: "XGBClassifier",
      trainedAt: "2026-08-20T00:00:00.000Z",
      metricValue: 1,
      featureCount: 50,
    },
    evaluatedAt: "2026-08-20T00:00:00.000Z",
    ...overrides,
  };
}

const render = (value: IndicatorsPrediction) =>
  renderToStaticMarkup(<PredictionPanel prediction={value} />);

describe("PredictionPanel", () => {
  it("dit en une phrase où en est l'apprenant", () => {
    const markup = render(prediction());

    expect(markup).toContain("Rien à signaler");
    expect(markup).toContain("ne laisse pas craindre de décrochage");
  });

  it("n'expose rien du modèle employé", () => {
    // Le formateur n'a que faire de l'algorithme ni de ses métriques.
    const markup = render(prediction());

    expect(markup).not.toContain("XGBClassifier");
    expect(markup).not.toContain("variables");
  });

  it("explique le signal repéré avec son seuil", () => {
    const markup = render(
      prediction({
        alert: {
          effectiveLevel: 1,
          fired: [
            {
              ruleId: 7,
              name: "Low connection",
              level: 1,
              description: "Moderately low engagement",
              matched: [
                {
                  indicator: "monthly_connection_days",
                  op: ">",
                  threshold: 2,
                  actual: 4,
                },
              ],
            },
          ],
        },
      }),
    );

    expect(markup).toContain("Connexions rares");
    expect(markup).toContain(
      "Jours de connexion : 4 jours (seuil : au-dessus de 2 jours)",
    );
  });

  it("signale ce qui manquait à l'analyse", () => {
    expect(render(prediction())).toContain(
      "Une donnée manquait : temps passé sur les contenus.",
    );
  });
});
