import { Check } from "lucide-react";
import { cn } from "../../utils/cn";
import type {
  LearningPreference,
} from "./types";
import { preferenceOptions } from "./learning-choice-options";

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
      className="grid gap-3 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Choix unique"
    >
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "relative cursor-pointer rounded-xl border transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
              compact ? "p-3" : "p-4",
              selected
                ? "border-primary bg-primary/10"
                : "border-base-300 hover:border-primary/50",
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
                  <span className="mt-1 block text-sm text-base-content/65">
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

export function PreferenceCards({
  value,
  onChange,
}: {
  value: LearningPreference[];
  onChange: (value: LearningPreference[]) => void;
}) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2"
      role="group"
      aria-label="Préférences d’apprentissage"
    >
      {preferenceOptions.map((option) => {
        const selected = value.includes(option.value);
        return (
          <label
            key={option.value}
            className={cn(
              "flex min-h-20 cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
              selected ? "border-primary bg-primary/10" : "border-base-300",
            )}
          >
            <input
              className="sr-only"
              type="checkbox"
              checked={selected}
              onChange={() =>
                onChange(
                  selected
                    ? value.filter((item) => item !== option.value)
                    : [...value, option.value],
                )
              }
            />
            <span className="font-semibold">{option.label}</span>
            <span
              className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded border",
                selected
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300",
              )}
              aria-hidden
            >
              {selected ? <Check className="size-4" /> : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
