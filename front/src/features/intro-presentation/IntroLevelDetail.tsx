import type { Ref } from "react";

import { cn } from "../../utils/cn";

import type { IntroCard } from "./intro-content";
import IntroChildrenList from "./IntroChildrenList";
import IntroDetailSection from "./IntroDetailSection";
import IntroExampleBadge from "./IntroExampleBadge";
import { INTRO_LEVELS } from "./intro-levels";

type Props = {
  card: IntroCard;
  /** Rang du niveau de la carte dans `INTRO_LEVELS`. */
  index: number;
  /** Composant expliqué par le chatbot : -1 quand il parle du niveau lui-même. */
  activeDetail: number;
  ref?: Ref<HTMLDivElement>;
};

/**
 * Ce que contient l'élément du niveau sélectionné : son titre, ses éléments
 * enfants, puis ses composants (groupes, tags...), chacun dans son cadre.
 * Il se déploie à côté de la plaque du niveau dans la pyramide.
 */
const IntroLevelDetail = ({ card, index, activeDetail, ref }: Props) => (
  <div
    ref={ref}
    aria-label={`${INTRO_LEVELS[index].label} : ${card.title}`}
    role="group"
    className="flex w-full flex-col gap-3"
  >
    <header className="intro-detail-part rounded-3xl border border-base-300 bg-base-200 px-5 py-3 shadow-xl">
      <p className="text-sm text-base-content/70">{INTRO_LEVELS[index].label}</p>
      <h2 className="flex flex-wrap items-center gap-2 text-2xl font-bold leading-tight">
        {card.title}
        {card.isPlaceholder ? <IntroExampleBadge /> : null}
      </h2>
    </header>

    <div className="intro-detail-part">
      <IntroChildrenList card={card} index={index} />
    </div>
    {card.details.length ? (
      <div
        className={cn(
          "grid gap-3",
          // Des cartes de même largeur : trois par ligne dès qu'il y en a trois ou plus.
          card.details.length >= 3
            ? "grid-cols-3"
            : card.details.length === 2
              ? "grid-cols-2"
              : "grid-cols-1",
        )}
      >
        {card.details.map((detail, detailIndex) => (
          <div key={detail.id} className="intro-detail-part min-w-0">
            <IntroDetailSection
              detail={detail}
              isActive={detailIndex === activeDetail}
            />
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

export default IntroLevelDetail;
