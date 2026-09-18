import { Check } from "lucide-react";
import { cn } from "../../utils/cn";
import type {
  FormationLevel,
  LearningPace,
  LearningPreference,
} from "./types";

export const paceOptions: Array<{ value: LearningPace; label: string; description: string }> = [
  { value: "progressive", label: "Progressif", description: "Avancer tranquillement, avec davantage d'explications." },
  { value: "standard", label: "Standard", description: "Un équilibre entre explications et mise en pratique." },
  { value: "intensive", label: "Soutenu", description: "Aller plus vite et droit à l'essentiel." },
  { value: "no_preference", label: "Sans préférence", description: "Adapter le rythme selon le contexte." },
];

export const preferenceOptions: Array<{ value: LearningPreference; label: string }> = [
  { value: "concrete_examples", label: "Exemples concrets" },
  { value: "step_by_step", label: "Pas-à-pas" },
  { value: "summary", label: "Synthèse" },
  { value: "practical_exercises", label: "Exercices pratiques" },
  { value: "visual_aids", label: "Supports visuels" },
];

export const levelOptions: Array<{ value: FormationLevel; label: string; description: string }> = [
  { value: "beginner", label: "Débutant", description: "Je découvre encore l'essentiel du sujet." },
  { value: "intermediate", label: "Intermédiaire", description: "Je possède déjà quelques bases." },
  { value: "advanced", label: "Avancé", description: "Je suis déjà à l'aise avec le sujet." },
  { value: "unsure", label: "Je ne sais pas encore", description: "Je préfère le déterminer en avançant." },
];

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
}: {
  name: string;
  options: SingleOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
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
              "relative cursor-pointer rounded-xl border p-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
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
              "flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
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
                "flex size-6 items-center justify-center rounded border",
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
