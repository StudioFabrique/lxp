import { cn } from "../../utils/cn";
import type { FormationLevel } from "./types";
import { levelOptions } from "./learning-choice-options";

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
    <div className="min-h-18">
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Niveau du module"
      >
        {levelOptions.map((option) => (
          <label
            key={option.value}
            className={cn(
              "btn h-auto min-h-11 cursor-pointer px-4 text-sm normal-case focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary",
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
