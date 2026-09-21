import Chart from "react-apexcharts";
import type { IndicatorsPrediction } from "../../interfaces/indicators";

type HistoricalAnalysis = IndicatorsPrediction & { analysisId: string };

const OUTCOMES = [
  { key: "graduate", name: "Réussite", color: "#22c55e" },
  { key: "fail", name: "Échec", color: "#f59e0b" },
  { key: "dropout", name: "Abandon", color: "#ef4444" },
] as const;

export default function AnalysisTimelineChart({ analyses }: { analyses: HistoricalAnalysis[] }) {
  const chronological = [...analyses].sort(
    (a, b) => new Date(a.evaluatedAt).getTime() - new Date(b.evaluatedAt).getTime(),
  );
  const series = OUTCOMES.map(({ key, name }) => ({
    name,
    data: chronological.map((analysis) => ({
      x: new Date(analysis.evaluatedAt).getTime(),
      y: Math.round((analysis.outcome.probabilities[key] ?? 0) * 100),
    })),
  }));
  const options = {
    chart: { id: "analysis-timeline", toolbar: { show: false }, zoom: { enabled: false }, animations: { enabled: false } },
    colors: OUTCOMES.map(({ color }) => color),
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" as const, width: 3 },
    markers: { size: chronological.length === 1 ? 5 : 4, hover: { sizeOffset: 2 } },
    grid: { borderColor: "rgba(148, 163, 184, 0.25)" },
    legend: { position: "top" as const, horizontalAlign: "left" as const },
    xaxis: {
      type: "datetime" as const,
      labels: { datetimeUTC: false, format: "dd MMM yy" },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: { formatter: (value: number) => `${Math.round(value)} %` },
      title: { text: "Probabilité estimée" },
    },
    tooltip: {
      shared: true,
      x: { format: "dd MMM yyyy, HH:mm" },
      y: { formatter: (value: number) => `${Math.round(value)} %` },
    },
  };

  return <div role="img" aria-label="Évolution chronologique des probabilités de réussite, d'échec et d'abandon" className="min-h-72 w-full">
    <Chart options={options} series={series} type="line" height={300} width="100%" />
  </div>;
}
