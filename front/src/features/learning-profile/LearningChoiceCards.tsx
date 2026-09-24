import { Check } from "lucide-react";
import { cn } from "../../utils/cn";
import type { FormationLevel, LearningPreference } from "./types";
import { levelOptions, preferenceOptions } from "./learning-choice-options";

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

export function LevelChoiceButtons({
  name,
  value,
  onChange,
}: {
  name: string;
  value: FormationLevel | null;
  onChange: (value: FormationLevel) => void;
}) {
  const selectedOption = levelOptions.find((option) => option.value === value);

  return (
    <div className="min-h-16">
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Niveau du module"
      >
        {levelOptions.map((option) => (
          <label
            key={option.value}
            className={cn(
              "btn btn-sm h-auto min-h-9 cursor-pointer px-3 normal-case focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary",
              value === option.value
                ? "btn-primary focus-within:ring-primary-content"
                : "btn-outline border-base-300 bg-base-100",
            )}
          >
            <input
              className="sr-only"
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {selectedOption && (
        <p className="mt-2 text-xs text-base-content/65">
          {selectedOption.description}
        </p>
      )}
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
