import toModelIndicators, {
  type AssessmentsSummary,
} from "../model-features.ts";
import type { Indicator, IndicatorsPayload } from "../types.ts";

function payload(
  indicators: Record<string, Indicator<any>>,
  from = "2026-07-21T00:00:00.000Z",
  to = "2026-08-20T00:00:00.000Z",
): IndicatorsPayload {
  return { userId: "abc", from, to, indicators };
}

function available<T>(
  key: string,
  value: T,
  unit?: Indicator["unit"],
): Indicator<T> {
  return { key, label: key, value, unit, available: true };
}

const assessments: AssessmentsSummary = {
  periodCount: 3,
  cumulativeCount: 8,
  passRate: 0.75,
};

describe("toModelIndicators", () => {
  it("convertit les durées de millisecondes en minutes", () => {
    const { indicators } = toModelIndicators(
      payload({
        session_time: available("session_time", 90 * 60_000, "ms"),
        time_on_content: available("time_on_content", 30 * 60_000, "ms"),
      }),
      assessments,
    );

    expect(indicators.session_time).toBe(90);
    expect(indicators.time_on_content).toBe(30);
  });

  it("traduit l'évolution en points de pourcentage en pente journalière", () => {
    const { indicators } = toModelIndicators(
      payload({
        correct_answer_rate_evolution: available(
          "correct_answer_rate_evolution",
          -30,
          "trend",
        ),
      }),
      assessments,
    );

    // -30 points sur une fenêtre de 30 jours : -0,01 point d'échelle par jour.
    expect(indicators.score_evolution).toBe(-0.01);
  });

  it("reprend la volumétrie des quiz telle quelle", () => {
    const { indicators } = toModelIndicators(payload({}), assessments);

    expect(indicators.assessment_count).toBe(3);
    expect(indicators.cumul_assessments).toBe(8);
    expect(indicators.pass_rate).toBe(0.75);
  });

  it("envoie null plutôt que zéro pour un indicateur indisponible", () => {
    const { indicators, missing } = toModelIndicators(
      payload({
        mood: {
          key: "mood",
          label: "Humeur déclarée",
          value: null,
          unit: "level",
          available: false,
          meta: { reason: "Aucun retour déposé sur la période." },
        },
      }),
      assessments,
    );

    expect(indicators.mood_proxy).toBeNull();
    expect(missing.mood_proxy).toBe("Aucun retour déposé sur la période.");
  });

  it("signale les variables sans source quand l'utilisateur n'est pas un apprenant", () => {
    const { indicators, missing } = toModelIndicators(payload({}), null);

    expect(indicators.assessment_count).toBeNull();
    expect(indicators.cumul_assessments).toBeNull();
    expect(indicators.pass_rate).toBeNull();
    expect(Object.keys(missing)).toEqual(
      expect.arrayContaining([
        "assessment_count",
        "cumul_assessments",
        "pass_rate",
      ]),
    );
  });

  it("justifie chaque variable absente", () => {
    const { indicators, missing } = toModelIndicators(payload({}), null);

    for (const [key, value] of Object.entries(indicators)) {
      if (value === null) expect(typeof missing[key]).toBe("string");
    }
  });

  it("ne signale rien quand toutes les variables sont renseignées", () => {
    const { missing } = toModelIndicators(
      payload({
        session_time: available("session_time", 60_000, "ms"),
        mood: available("mood", 4, "level"),
        monthly_connection_days: available("monthly_connection_days", 12, "count"),
        days_since_last_activity: available("days_since_last_activity", 2, "days"),
        time_on_content: available("time_on_content", 60_000, "ms"),
        quiz_interactions: available("quiz_interactions", 5, "count"),
        chatbot_interactions: available("chatbot_interactions", 7, "count"),
        correct_answer_rate_evolution: available(
          "correct_answer_rate_evolution",
          4,
          "trend",
        ),
      }),
      assessments,
    );

    expect(missing).toEqual({});
  });
});
