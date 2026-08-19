import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import ElementNotFound from "../../../../components/UI/element-not-found";
import Loader from "../../../../components/loaders/Loader";
import { localeDate } from "../../../../utils/helpers/locale-date";
import type { Indicator } from "../../interfaces/indicators";
import { toDisplayMinutes } from "../../helpers/format-indicator";
import IndicatorCard from "./IndicatorCard";
import VerticalBars from "./VerticalBars";

interface IndicatorsGridProps {
  indicators: Record<string, Indicator> | null;
  range: { from: string; to: string } | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Ordre d'affichage. Les clés absentes de la réponse sont ignorées, celles qui
 * s'y ajouteraient sans être listées ici sont affichées à la suite : ajouter un
 * indicateur côté API suffit à le voir apparaître.
 */
const DISPLAY_ORDER = [
  "session_time",
  "monthly_connection_days",
  "days_since_last_activity",
  "time_on_content",
  "parcours_progression",
  "mood",
  "chatbot_interactions",
  "chatbot_out_of_scope",
  "quiz_interactions",
  "correct_answer_rate",
  "correct_answer_rate_evolution",
];

/** Indicateurs dont la série temporelle mérite un graphique. */
const CHARTED = new Set([
  "session_time",
  "chatbot_interactions",
  "quiz_interactions",
]);

function sortIndicators(indicators: Record<string, Indicator>): Indicator[] {
  const known = DISPLAY_ORDER.filter((key) => key in indicators).map(
    (key) => indicators[key],
  );
  const extra = Object.keys(indicators)
    .filter((key) => !DISPLAY_ORDER.includes(key))
    .map((key) => indicators[key]);

  return [...known, ...extra];
}

export default function IndicatorsGrid({
  indicators,
  range,
  isLoading,
  isError,
}: IndicatorsGridProps) {
  if (isLoading) return <Loader />;

  if (isError || !indicators) {
    return (
      <ElementNotFound message="Impossible de charger les indicateurs de cet apprenant." />
    );
  }

  const ordered = sortIndicators(indicators);
  const charted = ordered.filter(
    (indicator) =>
      CHARTED.has(indicator.key) && (indicator.series?.length ?? 0) > 0,
  );

  return (
    <section className="flex flex-col gap-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold">Indicateurs de suivi</h2>
        {range ? (
          <p className="text-xs text-base-content/50">
            du {localeDate(range.from)} au {localeDate(range.to)}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ordered.map((indicator) => (
          <IndicatorCard key={indicator.key} indicator={indicator} />
        ))}
      </div>

      {charted.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {charted.map((indicator) => (
            <BoxWrapper key={`chart-${indicator.key}`}>
              <IndicatorChart indicator={indicator} />
            </BoxWrapper>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function IndicatorChart({ indicator }: { indicator: Indicator }) {
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
