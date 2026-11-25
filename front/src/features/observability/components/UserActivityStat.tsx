import { cn } from "../../../utils/cn";
import { formatNumber } from "../../../utils/helpers/format-number";

type Props = {
  label: string;
  value: number;
  unit?: string;
  valueClassName?: string;
};

/** Petit chiffre de synthèse, en tête du tiroir d'activité d'une personne. */
export default function UserActivityStat({ label, value, unit, valueClassName }: Readonly<Props>) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-3">
      <p className="text-xs text-base-content/70">{label}</p>
      <p className={cn("text-2xl font-bold text-primary", valueClassName)}>
        {formatNumber(value)}
        {unit && <span className="ml-1 text-sm">{unit}</span>}
      </p>
    </div>
  );
}
