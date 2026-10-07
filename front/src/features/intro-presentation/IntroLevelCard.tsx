import type { Ref } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "../../utils/cn";
import type { IntroCard } from "./intro-content";
import IntroExampleBadge from "./IntroExampleBadge";
import { INTRO_LEVELS } from "./intro-levels";

type Props = {
  card: IntroCard;
  index: number;
  isCurrent: boolean;
  ref?: Ref<HTMLElement>;
  /**
   * Descend d'un niveau. `originY` est la position de la ligne cliquée dans la
   * carte, d'où grandit la carte suivante. Absent sur le dernier niveau.
   */
  onDescend?: (originY: number) => void;
};

/**
 * Carte d'un niveau. Seule la première ligne mène au niveau suivant : c'est
 * l'élément dont la suite est présentée, les autres lignes sont des voisins
 * dont le contenu n'est pas détaillé.
 */
const IntroLevelCard = ({ card, index, isCurrent, ref, onDescend }: Props) => {
  const level = INTRO_LEVELS[index];
  const childLevel = INTRO_LEVELS[Math.min(index + 1, INTRO_LEVELS.length - 1)];
  const ChildIcon = childLevel.icon;
  const isLeaf = onDescend === undefined;

  return (
    <article
      ref={ref}
      tabIndex={-1}
      inert={!isCurrent}
      aria-hidden={!isCurrent}
      aria-label={`${level.label} : ${card.title}`}
      className={cn(
        "intro-card absolute inset-x-0 top-0 mx-auto w-full max-w-xl rounded-3xl border border-base-300 bg-base-200 p-6 shadow-xl outline-none",
        index > 0 && "opacity-0",
      )}
    >
      <p className="text-sm text-base-content/70">{level.label}</p>
      <h2 className="flex flex-wrap items-center gap-2 text-3xl font-bold">
        {card.title}
        {card.isPlaceholder ? <IntroExampleBadge /> : null}
      </h2>
      <p className="mt-1 text-base-content/70">
        {isLeaf
          ? `${card.rows.length} types d'activités disponibles`
          : `${card.rows.length} ${level.childrenPlural}`}
      </p>

      <ul className="mt-5 flex flex-col">
        {card.rows.map((row, rowIndex) => {
          const isGuided = rowIndex === 0 && !isLeaf;
          const content = (
            <>
              <ChildIcon
                className="size-6 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm text-base-content/70">
                  {isLeaf
                    ? "Type d'activité"
                    : `${level.childrenLabel} ${rowIndex + 1}`}
                </span>
                <span className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                  {row.title}
                  {row.isPlaceholder ? <IntroExampleBadge /> : null}
                </span>
              </span>
              {isGuided ? (
                <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
              ) : null}
            </>
          );

          return (
            <li
              key={`${row.title}-${rowIndex}`}
              className={cn(rowIndex > 0 && "border-t border-base-300")}
            >
              {isGuided ? (
                <button
                  type="button"
                  className="flex w-full items-center gap-4 rounded-2xl bg-base-300/60 px-3 py-3 text-left transition-colors hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-primary"
                  onClick={(event) =>
                    onDescend?.(
                      event.currentTarget.offsetTop +
                        event.currentTarget.offsetHeight / 2,
                    )
                  }
                >
                  {content}
                </button>
              ) : (
                <div className="flex items-center gap-4 px-3 py-3">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
};

export default IntroLevelCard;
