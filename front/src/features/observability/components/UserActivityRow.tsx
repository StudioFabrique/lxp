import { cn } from "../../../utils/cn";
import { formatNumber } from "../../../utils/helpers/format-number";
import { localeTime } from "../../../utils/helpers/locale-date";
import type { UserActivity } from "../api/observability.api";
import { statusLabel } from "../helpers/status-labels";
import RouteLabel from "./RouteLabel";

type Props = { action: UserActivity["actions"][number] };

export default function UserActivityRow({ action }: Props) {
  return (
    <li className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-start gap-3 border-b border-base-300 py-2.5 last:border-b-0">
      <time
        dateTime={action.time}
        className="pt-0.5 text-xs tabular-nums text-base-content/70"
      >
        {localeTime(action.time)}
      </time>
      <RouteLabel method={action.method} path={action.path} targets={action.targets} />
      <div className="flex flex-col items-end gap-1">
        <span
          className={cn(
            "badge badge-sm",
            action.status >= 500 && "badge-error",
            action.status >= 400 && action.status < 500 && "badge-warning",
            action.status < 400 && "badge-ghost",
          )}
        >
          {action.status}
          <span className="sr-only"> {statusLabel(action.status)}</span>
        </span>
        <span className="text-xs tabular-nums text-base-content/70">
          {formatNumber(action.durationMs)} ms
        </span>
      </div>
    </li>
  );
}
