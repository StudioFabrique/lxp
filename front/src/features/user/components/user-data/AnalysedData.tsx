import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { formatModelIndicatorLabel, formatModelIndicatorValue } from "../../helpers/format-prediction";
import { type PredictionPanelProps } from "./PredictionPanel.types";

/** Les données de la période sur lesquelles l'analyse s'est appuyée. */
export function AnalysedData({ prediction }: PredictionPanelProps) {
  return (
    <BoxWrapper>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(prediction.indicators).map(([key, value]) => (
          <li key={key} className="flex flex-col gap-y-0.5">
            <span className="text-xs text-base-content/50">
              {formatModelIndicatorLabel(key)}
            </span>
            <span className="text-sm font-bold">
              {formatModelIndicatorValue(key, value)}
            </span>
            {value === null && prediction.missing[key] ? (
              <span className="text-xs italic text-base-content/50">
                {prediction.missing[key]}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </BoxWrapper>
  );
}
