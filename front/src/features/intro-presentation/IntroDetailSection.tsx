import { cn } from "../../utils/cn";
import type { IntroDetail } from "./intro-content";
import IntroSectionFrame from "./IntroSectionFrame";

type Props = {
  detail: IntroDetail;
  /** Vrai quand l’assistant virtuel est en train d'expliquer ce composant. */
  isActive: boolean;
};

/** Composant d'un niveau (groupes, tags, objectifs...) : ses valeurs, réelles ou d'exemple. */
const IntroDetailSection = ({ detail, isActive }: Props) => (
  <IntroSectionFrame
    icon={detail.icon}
    title={detail.label}
    detailId={detail.id}
    isActive={isActive}
  >
    <ul className="mt-3 flex flex-wrap gap-2">
      {detail.items.map((item, index) => (
        <li
          key={`${item.title}-${index}`}
          className={cn(
            "badge badge-outline h-auto max-w-full px-3 py-1.5",
            // Valeur d'exemple : distinguée par le texte atténué, pas par une bordure en tirets.
            item.isPlaceholder && "text-base-content/70",
          )}
        >
          <span className="truncate">{item.title}</span>
        </li>
      ))}
    </ul>
  </IntroSectionFrame>
);

export default IntroDetailSection;
