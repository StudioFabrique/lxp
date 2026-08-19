import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import FeelingLevel from "../../../../components/UI/feeling-level";
import type { Indicator } from "../../interfaces/indicators";
import {
  formatIndicatorValue,
  indicatorEmptyMessage,
} from "../../helpers/format-indicator";

interface IndicatorCardProps {
  indicator: Indicator;
}

/**
 * Carte générique : l'affichage est piloté par `unit`, si bien qu'ajouter un
 * indicateur côté API ne demande aucun composant supplémentaire ici.
 */
export default function IndicatorCard({ indicator }: IndicatorCardProps) {
  const { available, label, unit, value } = indicator;

  return (
    <BoxWrapper>
      <div className="flex h-full flex-col justify-between gap-y-2">
        <h3 className="text-sm font-bold text-base-content/70">{label}</h3>

        {available ? (
          <div className="flex items-center gap-x-3">
            {unit === "level" && typeof value === "number" ? (
              <FeelingLevel value={value} size={8} />
            ) : null}
            <p className="text-2xl font-bold">
              {formatIndicatorValue(value, unit)}
            </p>
          </div>
        ) : (
          // Un zéro laisserait croire à une mesure faite, alors qu'aucune
          // donnée n'a été collectée.
          <p className="text-sm italic text-base-content/50">
            {indicatorEmptyMessage(indicator)}
          </p>
        )}

        {available ? <IndicatorHint indicator={indicator} /> : null}
      </div>
    </BoxWrapper>
  );
}

/** Précision secondaire, quand la métadonnée s'y prête. */
function IndicatorHint({ indicator }: IndicatorCardProps) {
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
