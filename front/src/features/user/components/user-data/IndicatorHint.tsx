import { type IndicatorCardProps } from "./IndicatorCard.types";

/** Précision secondaire, quand la métadonnée s'y prête. */
export function IndicatorHint({ indicator }: IndicatorCardProps) {
  const meta = indicator.meta ?? {};

  switch (indicator.key) {
    case "chatbot_out_of_scope":
      return typeof meta.shareOfQuestionsPercent === "number" ? (
        <p className="text-xs text-base-content/50">
          {meta.shareOfQuestionsPercent} % des questions posées
        </p>
      ) : null;

    case "quiz_interactions":
      return typeof meta.selfTest === "number" ? (
        <p className="text-xs text-base-content/50">
          dont {meta.selfTest} en « je veux me tester »
        </p>
      ) : null;

    case "correct_answer_rate":
      return typeof meta.totalAnswers === "number" ? (
        <p className="text-xs text-base-content/50">
          sur {meta.totalAnswers} réponses
        </p>
      ) : null;

    case "correct_answer_rate_evolution":
      return typeof meta.trend === "string" ? (
        <p className="text-xs text-base-content/50">{String(meta.trend)}</p>
      ) : null;

    case "mood":
      return typeof meta.averageLevel === "number" ? (
        <p className="text-xs text-base-content/50">
          moyenne {meta.averageLevel} / 5
        </p>
      ) : null;

    default:
      return null;
  }
}
