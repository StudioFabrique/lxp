import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { formatNumber } from "../../../utils/helpers/format-number";

type Props = {
  label: string;
  value: number;
  /** Précision sous le libellé. */
  hint?: string;
};

/** Gros bloc de statistique, au format des totaux des journaux de l'instance. */
export default function TokenStatBlock({ label, value, hint }: Readonly<Props>) {
  return (
    <BoxWrapper className="min-h-32 justify-between gap-2 p-4 font-bold text-primary">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base">{label}</p>
          {hint && (
            <p className="text-xs font-normal text-base-content/70">{hint}</p>
          )}
        </div>
        <p className="shrink-0 text-4xl lg:text-5xl">{formatNumber(value)}</p>
      </div>
    </BoxWrapper>
  );
}
