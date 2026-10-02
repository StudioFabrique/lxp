import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import FeelingLevel from "../../../../components/UI/feeling-level";
import { formatIndicatorValue, indicatorEmptyMessage } from "../../helpers/format-indicator";
import { type IndicatorCardProps } from "./IndicatorCard.types";
import { IndicatorHint } from "./IndicatorHint";

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
