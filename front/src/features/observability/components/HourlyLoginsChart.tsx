import { useMemo } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { formatNumber } from "../../../utils/helpers/format-number";
import { groupLoginsByLocalHour } from "../helpers/hourly-logins";

type Props = { buckets: { time: string; count: number }[] };

const hourLabels = Array.from({ length: 24 }, (_, hour) => `${hour} h`);
const textColor = "var(--color-base-content)";

export default function HourlyLoginsChart({ buckets }: Readonly<Props>) {
  const hours = useMemo(() => groupLoginsByLocalHour(buckets), [buckets]);
  const total = hours.reduce((sum, count) => sum + count, 0);
  const peakCount = Math.max(...hours);
  const peakHour = hours.indexOf(peakCount);

  const options: ApexOptions = useMemo(
    () => ({
      chart: { toolbar: { show: false }, fontFamily: "inherit", animations: { enabled: false } },
      colors: ["var(--color-primary)"],
      dataLabels: { enabled: false },
      grid: { borderColor: "var(--color-base-300)" },
      plotOptions: { bar: { borderRadius: 3, columnWidth: "70%" } },
      xaxis: {
        categories: hourLabels,
        labels: { style: { colors: textColor }, rotate: -45 },
        tickPlacement: "on",
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        decimalsInFloat: 0,
        labels: { formatter: (value: number) => formatNumber(value), style: { colors: [textColor] } },
      },
      tooltip: {
        y: {
          formatter: (value: number) =>
            `${formatNumber(value)} connexion${value > 1 ? "s" : ""}`,
        },
      },
    }),
    [],
  );

  return (
    <BoxWrapper className="mb-4">
      <div>
        <h2 className="text-lg font-bold">Connexions par heure de la journée</h2>
        <p className="text-sm text-base-content/70">
          {total === 0
            ? "Aucune connexion sur cette période."
            : `Heure locale. Pic à ${peakHour} h : ${formatNumber(peakCount)} connexion${peakCount > 1 ? "s" : ""} sur ${formatNumber(total)}.`}
        </p>
      </div>
      <div role="img" aria-label="Histogramme des connexions par heure de la journée">
        <Chart
          type="bar"
          height={280}
          width="100%"
          series={[{ name: "Connexions", data: hours }]}
          options={options}
        />
      </div>
      <table className="sr-only">
        <caption>Connexions par heure de la journée</caption>
        <thead>
          <tr>
            <th scope="col">Heure</th>
            <th scope="col">Connexions</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((count, hour) => (
            <tr key={hourLabels[hour]}>
              <th scope="row">{hourLabels[hour]}</th>
              <td>{formatNumber(count)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </BoxWrapper>
  );
}
