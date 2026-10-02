import { cn } from "../../../../../utils/cn";

type CardProgressProps = {
  progress?: number;
  label: string;
  selected?: boolean;
};

const CardProgress = ({ progress = 0, label, selected }: CardProgressProps) => {
  const value = Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress))
    : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-lg",
        selected ? "bg-primary-content/10" : "bg-primary/10",
      )}
    >
      <div
        className={cn(
          "h-full",
          selected ? "bg-primary-content/60" : "bg-primary/60",
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default CardProgress;
