import { localeDate } from "../../helpers/locale-date";
import VerticalBars from "../UI/vertical-bars";
import { TokenStat } from "./user-connection";

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
    localeDate(item.lastConnection),
  );
  const series = connectionTime.map((item) =>
    Math.ceil(item.duration / 3600000),
  );

  return (
    <div className="w-full h-[100%]">
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
        width="100%"
        height="200px"
      />
    </div>
  );
}

type Props = {
  tokenStats: TokenStat[];
};

export function TokensUsed(props: Props) {
  const categories = props.tokenStats.map((item) => localeDate(item.date));
  const series = props.tokenStats.map((item) => item.tokensUsed);

  console.log({ props });

  return (
    <div className="w-full h-[100%]">
      <h2 className="text-xs font-bold">Tokens utilisés</h2>
      <VerticalBars
        categories={categories}
        series={[
          {
            name: "tokens",
            data: series,
          },
        ]}
        label="Qté de tokens utilisés"
        type="bar"
        warning={2}
        width="100%"
        height="200px"
      />
    </div>
  );
}
