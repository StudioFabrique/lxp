import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

type SingleOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

export function SingleChoiceCards<T extends string>({
  name,
  options,
  value,
  onChange,
  compact = false,
}: {
  name: string;
  options: SingleOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn("grid sm:grid-cols-2", compact ? "gap-2" : "gap-3")}
      role="radiogroup"
      aria-label="Choix unique"
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "relative cursor-pointer rounded-xl border transition-colors focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary",
              compact ? "p-2.5" : "p-4",
              selected
                ? "border-primary bg-primary/10"
                : "border-base-300 bg-base-200 hover:border-primary/50",
            )}
          >
            <input
              className="sr-only"
              type="radio"
              name={name}
              checked={selected}
              onChange={() => onChange(option.value)}
            />
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block font-semibold">{option.label}</span>
                {option.description ? (
                  <span
                    className={cn(
                      "block text-sm text-base-content/65",
                      compact ? "mt-0.5" : "mt-1",
                    )}
                  >
                    {option.description}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-primary bg-primary text-primary-content"
                    : "border-base-300",
                )}
                aria-hidden
              >
                {selected ? <Check className="size-4" /> : null}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
