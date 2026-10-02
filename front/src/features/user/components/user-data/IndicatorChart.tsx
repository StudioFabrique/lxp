import { localeDate } from "../../../../utils/helpers/locale-date";
import type { Indicator } from "../../interfaces/indicators";
import { toDisplayMinutes } from "../../helpers/format-indicator";
import VerticalBars from "./VerticalBars";

export function IndicatorChart({ indicator }: { indicator: Indicator }) {
  const series = indicator.series ?? [];

  // Les durées sont converties en minutes pour le graphique : en heures, une
  // session de vingt minutes donne une barre invisible.
  const isDuration = indicator.unit === "ms";
  const values = series.map((point) =>
    isDuration ? toDisplayMinutes(point.value) : point.value,
  );

  return (
    <div className="h-full w-full">
      <h3 className="text-xs font-bold">{indicator.label}</h3>
      <VerticalBars
        categories={series.map((point) => localeDate(point.date))}
        series={[
          { name: isDuration ? "minutes" : "nombre", data: values },
        ]}
        label={indicator.label}
        type="bar"
        width="100%"
        height="200px"
      />
    </div>
  );
}
