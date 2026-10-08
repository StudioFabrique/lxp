import { ChevronRight } from "lucide-react";

import { cn } from "../../utils/cn";
import type { IntroCard } from "./intro-content";
import IntroExampleBadge from "./IntroExampleBadge";
import IntroSectionFrame from "./IntroSectionFrame";
import { INTRO_LEVELS } from "./intro-levels";

type Props = {
  card: IntroCard;
  /** Rang du niveau de la carte. */
  index: number;
  /**
   * Descend d'un niveau. `originY` est la position de la ligne cliquée dans la
   * carte, d'où grandit la carte suivante. Absent sur le dernier niveau.
   */
  onDescend?: (originY: number) => void;
};

/**
 * Éléments que contient le niveau, dans leur propre cadre. Seule la première
 * ligne mène au niveau suivant : c'est l'élément dont la suite est présentée,
 * les autres sont des voisins dont le contenu n'est pas détaillé.
 */
const IntroChildrenList = ({ card, index, onDescend }: Props) => {
  const level = INTRO_LEVELS[index];
  const childLevel = INTRO_LEVELS[Math.min(index + 1, INTRO_LEVELS.length - 1)];
  const ChildIcon = childLevel.icon;
  const isLeaf = onDescend === undefined;

  return (
    <IntroSectionFrame
      className="p-4 shadow-lg"
      icon={ChildIcon}
      title={
        isLeaf
          ? `${card.rows.length} types d'activités disponibles`
          : `${card.rows.length} ${level.childrenPlural}`
      }
    >
      <ul className="mt-2 flex flex-col">
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
    </IntroSectionFrame>
  );
};

export default IntroChildrenList;
