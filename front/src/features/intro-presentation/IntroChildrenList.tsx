import { ChevronRight } from "lucide-react";

import { cn } from "../../utils/cn";
import type { IntroCard } from "./intro-content";
import IntroSectionFrame from "./IntroSectionFrame";
import { INTRO_LEVELS } from "./intro-levels";

type Props = {
  card: IntroCard;
  /** Rang du niveau de la carte. */
  index: number;
  /** Ligne survolée, aussi dans la pile 3D : -1 si aucune. */
  highlightedRow?: number;
  onHighlightRow?: (row: number) => void;
  /** Clic sur une ligne : découverte de l'élément (ou aperçu d'un type d'activité). */
  onSelectRow?: (row: number) => void;
};

/** Éléments que contient le niveau, dans leur propre cadre. */
const IntroChildrenList = ({ card, index, highlightedRow = -1, onHighlightRow, onSelectRow }: Props) => {
  const level = INTRO_LEVELS[index];
  const isLeaf = index === INTRO_LEVELS.length - 1;
  const childLevel = INTRO_LEVELS[Math.min(index + 1, INTRO_LEVELS.length - 1)];
  const ChildIcon = childLevel.icon;

  return (
    <IntroSectionFrame
      detailId="children"
      icon={ChildIcon}
      title={
        isLeaf
          ? `${card.rows.length} types d'activités`
          : `${card.rows.length} ${level.childrenPlural}`
      }
    >
      {card.rows.length === 0 ? (
        <p className="mt-2 text-sm text-base-content/70">Aucun contenu accessible à ce niveau. Vous pouvez choisir une autre formation.</p>
      ) : null}
      <ul className="mt-3 flex flex-col gap-2">
        {card.rows.map((row, rowIndex) => {
          const isHighlighted = rowIndex === highlightedRow;
          const content = (
            <>
              <ChildIcon
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isHighlighted ? "text-primary" : "text-base-content/50",
                )}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-left">{row.title}</span>
              {onSelectRow ? (
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0 transition-all",
                    isHighlighted ? "translate-x-0.5 text-primary" : "text-base-content/40",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </>
          );
          const rowClassName = cn(
            "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-base font-semibold transition-colors",
            isHighlighted
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-base-300 bg-base-100/60",
            onSelectRow && "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          );
          return (
            <li
              key={`${row.title}-${rowIndex}`}
              data-highlighted={isHighlighted ? "true" : undefined}
              onMouseEnter={() => onHighlightRow?.(rowIndex)}
              onMouseLeave={() => onHighlightRow?.(-1)}
            >
              {onSelectRow ? (
                <button
                  type="button"
                  className={rowClassName}
                  aria-label={isLeaf ? `Voir un exemple : ${row.title}` : `Découvrir ${row.title}`}
                  onFocus={() => onHighlightRow?.(rowIndex)}
                  onBlur={() => onHighlightRow?.(-1)}
                  onClick={() => onSelectRow(rowIndex)}
                >
                  {content}
                </button>
              ) : (
                <div className={rowClassName}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </IntroSectionFrame>
  );
};

export default IntroChildrenList;
