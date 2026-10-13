import { cn } from "../../utils/cn";
import type { IntroFormationOption } from "./intro-example-formations";

type Props = {
  options: readonly IntroFormationOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** Même présentation que le filtre par parcours ; choix unique, sans option « Tous ». */
const IntroFormationSelector = ({ options, selectedId, onSelect }: Props) => (
  <fieldset className="flex w-full flex-col gap-2">
    <legend className="mb-2 text-sm font-semibold">Formation présentée</legend>
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choix de la formation présentée">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={cn("btn btn-sm h-auto min-h-8 cursor-pointer py-2 text-left", selectedId === option.id ? "btn-primary" : "btn-outline")}
          aria-pressed={selectedId === option.id}
          onClick={() => onSelect(option.id)}
        >
          {option.title}{option.isCurrent ? " (formation actuelle)" : ""}
        </button>
      ))}
    </div>
  </fieldset>
);

export default IntroFormationSelector;
