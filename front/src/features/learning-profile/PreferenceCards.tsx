import { Check } from "lucide-react";
import { cn } from "../../utils/cn";
import type { LearningPreference } from "./types";
import { preferenceOptions } from "./learning-choice-options";

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
              "flex min-h-20 cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary",
              selected
                ? "border-primary bg-primary/10"
                : "border-base-300 bg-base-200",
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
