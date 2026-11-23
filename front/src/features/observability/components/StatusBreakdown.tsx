import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { formatNumber } from "../../../utils/helpers/format-number";
import { cn } from "../../../utils/cn";
import { groupStatusByClass } from "../helpers/status-classes";

type Props = { breakdown: { status: string; count: number }[] };

export default function StatusBreakdown({ breakdown }: Props) {
  const classes = groupStatusByClass(breakdown);
  const total = classes.reduce((sum, { count }) => sum + count, 0);

  return (
    <BoxWrapper>
      <h2 className="text-lg font-bold">Réponses de l'API</h2>
      <div className="flex flex-col gap-4">
        {total === 0 ? (
          <p className="text-base-content/70">Aucune requête sur cette période.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {classes.map(({ key, label, progressClassName, count }) => {
              const percent = (count / total) * 100;
              return (
                <li key={key}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                    <span>{label}</span>
                    <span className="font-semibold">
                      {formatNumber(count)}
                      <span className="ml-2 font-normal text-base-content/70">
                        {formatNumber(percent, { maximumFractionDigits: 1 })} %
                      </span>
                    </span>
                  </div>
                  <progress
                    className={cn("progress w-full", progressClassName)}
                    value={percent}
                    max={100}
                    aria-label={`${label} : ${formatNumber(percent, { maximumFractionDigits: 1 })} % des requêtes`}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </BoxWrapper>
  );
}
