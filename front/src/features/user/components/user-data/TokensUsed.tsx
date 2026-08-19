import { localeDate } from "../../../../utils/helpers/locale-date";
import type { TokenStat } from "./UserConnection";
import VerticalBars from "./VerticalBars";

type Props = {
  tokenStats: TokenStat[];
};

/**
 * Consommation de tokens IA par jour.
 *
 * Reste alimenté par `GET /user/data/:id` : les tokens relèvent du coût
 * d'exploitation, pas du suivi pédagogique, et ne font donc pas partie des
 * indicateurs apprenant.
 */
export default function TokensUsed({ tokenStats }: Props) {
  return (
    <div className="w-full h-full">
      <h2 className="text-xs font-bold">Tokens utilisés</h2>
      <VerticalBars
        categories={tokenStats.map((item) => localeDate(item.date))}
        series={[
          { name: "tokens", data: tokenStats.map((item) => item.tokensUsed) },
        ]}
        label="Qté de tokens utilisés"
        type="bar"
        width="100%"
        height="200px"
      />
    </div>
  );
}
