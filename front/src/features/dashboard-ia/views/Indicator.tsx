import { cn } from "../../../utils/cn";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function Indicator({
  label,
  value,
  detail,
  reverse = false,
}: {
  label: string;
  value: number | null;
  detail: string;
  reverse?: boolean;
}) {
  const percent =
    value === null || !Number.isFinite(value) ? null : clamp(value);
  const color =
    percent === null
      ? "text-base-content/40"
      : reverse
        ? percent >= 70
          ? "text-error"
          : percent >= 40
            ? "text-warning"
            : "text-success"
        : percent < 40
          ? "text-error"
          : percent < 70
            ? "text-warning"
            : "text-success";
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-2 text-center">
      <div
        className={cn("radial-progress", color)}
        style={
          {
            "--value": percent ?? 0,
            "--size": "4.5rem",
            "--thickness": "5px",
          } as React.CSSProperties
        }
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="text-sm font-semibold">
          {percent === null ? "—" : `${percent}%`}
        </span>
      </div>
      <div className="flex min-h-10 flex-col items-center justify-start">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-base-content/65">{detail}</p>
      </div>
    </div>
  );
}
