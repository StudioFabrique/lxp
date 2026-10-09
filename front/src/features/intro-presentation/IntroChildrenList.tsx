import { cn } from "../../utils/cn";
import type { IntroCard } from "./intro-content";
import IntroExampleBadge from "./IntroExampleBadge";
import IntroSectionFrame from "./IntroSectionFrame";
import { INTRO_LEVELS } from "./intro-levels";

type Props = {
  card: IntroCard;
  /** Rang du niveau de la carte. */
  index: number;
  /** Ligne survolée, aussi dans la pile 3D : -1 si aucune. */
  highlightedRow?: number;
  onHighlightRow?: (row: number) => void;
};

/** Éléments que contient le niveau, dans leur propre cadre. */
const IntroChildrenList = ({ card, index, highlightedRow = -1, onHighlightRow }: Props) => {
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
      <ul className="mt-1 flex flex-col">
        {card.rows.map((row, rowIndex) => (
          <li
            key={`${row.title}-${rowIndex}`}
            data-highlighted={rowIndex === highlightedRow ? "true" : undefined}
            onMouseEnter={() => onHighlightRow?.(rowIndex)}
            onMouseLeave={() => onHighlightRow?.(-1)}
            className={cn(
              "flex items-center gap-2 py-1 text-base font-semibold transition-colors",
              rowIndex > 0 && "border-t border-base-300",
              rowIndex === highlightedRow && "bg-primary/15 text-primary",
            )}
          >
            <span className="min-w-0 truncate">{row.title}</span>
            {row.isPlaceholder ? <IntroExampleBadge /> : null}
          </li>
        ))}
      </ul>
    </IntroSectionFrame>
  );
};

export default IntroChildrenList;
