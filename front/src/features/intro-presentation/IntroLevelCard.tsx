import type { Ref } from "react";

import { cn } from "../../utils/cn";
import type { IntroCard } from "./intro-content";
import IntroChildrenList from "./IntroChildrenList";
import IntroDetailSection from "./IntroDetailSection";
import IntroExampleBadge from "./IntroExampleBadge";
import { INTRO_LEVELS } from "./intro-levels";

type Props = {
  card: IntroCard;
  index: number;
  isCurrent: boolean;
  /** Composant expliqué par le chatbot : -1 quand il parle du niveau lui-même. */
  activeDetail?: number;
  ref?: Ref<HTMLElement>;
  /** Descend d'un niveau depuis la ligne cliquée (voir `IntroChildrenList`). */
  onDescend?: (originY: number) => void;
};

/** Niveau : sa carte de titre, puis chaque partie dans son propre cadre détaché. */
const IntroLevelCard = ({
  card,
  index,
  isCurrent,
  activeDetail = -1,
  ref,
  onDescend,
}: Props) => {
  const level = INTRO_LEVELS[index];

  return (
    <article
      ref={ref}
      tabIndex={-1}
      inert={!isCurrent}
      aria-hidden={!isCurrent}
      aria-label={`${level.label} : ${card.title}`}
      className={cn(
        "intro-card absolute inset-x-0 top-0 flex w-full max-w-lg flex-col gap-4 outline-none",
        index > 0 && "opacity-0",
      )}
    >
      <header className="rounded-3xl border border-base-300 bg-base-200 px-6 py-5 shadow-xl">
        <p className="text-sm text-base-content/70">{level.label}</p>
        <h2 className="flex flex-wrap items-center gap-2 text-3xl font-bold">
          {card.title}
          {card.isPlaceholder ? <IntroExampleBadge /> : null}
        </h2>
      </header>

      <IntroChildrenList card={card} index={index} onDescend={onDescend} />
      {card.details.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {card.details.map((detail, detailIndex) => (
            <IntroDetailSection
              key={detail.id}
              detail={detail}
              isActive={isCurrent && detailIndex === activeDetail}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
};

export default IntroLevelCard;
