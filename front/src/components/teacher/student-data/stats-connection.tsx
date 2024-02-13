import { localeDate } from "../../../helpers/locale-date";
import VerticalBars from "../../UI/vertical-bars";

interface StatsConnectionProps {
  connectionTime: Array<{
    lastConnection: string;
    duration: number;
  }>;
}
export default function StatsConnection({
  connectionTime,
}: StatsConnectionProps) {
  const categories = connectionTime.map((item) =>
    localeDate(item.lastConnection)
  );
  const series = connectionTime.map((item) =>
    Math.ceil(item.duration / 3600000)
  );

  return (
    <div className="w-full">
      <h2 className="text-xs font-bold">Durée des sessions</h2>
      <VerticalBars
        categories={categories}
        series={[
          {
            name: "heures",
            data: series,
          },
        ]}
        label="Durée des sessions"
        type="bar"
        warning={2}
        width="600px"
      />
    </div>
  );
}
