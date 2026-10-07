import { cn } from "../../utils/cn";
import { INTRO_LEVELS } from "./intro-levels";

type Props = {
  activeIndex: number;
  /** Dernier niveau sélectionnable ; les suivants sont à découvrir. */
  selectableUpTo: number;
  onSelect: (index: number) => void;
};

/** Les sept niveaux, chacun décalé du précédent pour montrer l'emboîtement. */
const IntroLevelRail = ({ activeIndex, selectableUpTo, onSelect }: Props) => (
  <nav aria-label="Niveaux pédagogiques">
    <ol className="flex flex-col gap-2">
      {INTRO_LEVELS.map((level, index) => {
        const Icon = level.icon;
        const isActive = index === activeIndex;

        return (
          <li key={level.id} style={{ marginLeft: `${index * 1.1}rem` }}>
            <button
              type="button"
              disabled={index > selectableUpTo}
              aria-current={isActive ? "step" : undefined}
              onClick={() => onSelect(index)}
              className={cn(
                "flex items-center gap-3 rounded-2xl p-1.5 pr-4 text-left transition-colors disabled:cursor-default",
                isActive
                  ? "bg-base-100 shadow-lg ring-1 ring-base-300"
                  : "enabled:hover:bg-base-200",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl border transition-colors",
                  index <= activeIndex
                    ? "border-primary bg-primary text-primary-content"
                    : "border-base-300 bg-base-100 text-primary",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span
                className={cn(
                  "text-base font-semibold sm:text-lg",
                  !isActive && "text-base-content/70",
                )}
              >
                {level.label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default IntroLevelRail;
