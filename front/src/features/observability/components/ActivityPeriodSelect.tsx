import { cn } from "../../../utils/cn";
import { activityPeriods, type ActivityPeriod } from "../api/observability.api";
import { presetRange, type ActivityRange } from "../helpers/activity-range";
import ActivityRangePopover from "./ActivityRangePopover";

const labels: Record<ActivityPeriod, string> = {
  "24h": "24 heures",
  "7d": "7 jours",
  "30d": "30 jours",
};

type Props = {
  value: ActivityRange;
  onChange: (range: ActivityRange) => void;
};

export default function ActivityPeriodSelect({ value, onChange }: Readonly<Props>) {
  return (
    <div
      role="group"
      aria-label="Période analysée"
      className="mb-4 flex w-full flex-wrap items-center justify-center gap-2"
    >
      {activityPeriods.map((period) => {
        const selected = value.kind === "preset" && value.period === period;
        return (
          <button
            key={period}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(presetRange(period))}
            className={cn("btn btn-sm cursor-pointer", selected ? "btn-primary" : "btn-outline")}
          >
            {labels[period]}
          </button>
        );
      })}
      <ActivityRangePopover value={value} onApply={onChange} />
    </div>
  );
}
