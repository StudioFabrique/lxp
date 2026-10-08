import { cn } from "../../utils/cn";
import type { IntroDetail } from "./intro-content";
import IntroSectionFrame from "./IntroSectionFrame";

type Props = {
  detail: IntroDetail;
  /** Vrai quand le chatbot est en train d'expliquer ce composant. */
  isActive: boolean;
};

/** Composant d'un niveau (groupes, tags, objectifs...) : ses valeurs, réelles ou d'exemple. */
const IntroDetailSection = ({ detail, isActive }: Props) => (
  <IntroSectionFrame
    icon={detail.icon}
    title={detail.label}
    detailId={detail.id}
    isPlaceholder={detail.isPlaceholder}
    isActive={isActive}
  >
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {detail.items.map((item, index) => (
        <li
          key={`${item.title}-${index}`}
          className={cn(
            "badge badge-outline max-w-full",
            item.isPlaceholder && "border-dashed",
          )}
        >
          <span className="truncate">{item.title}</span>
        </li>
      ))}
    </ul>
  </IntroSectionFrame>
);

export default IntroDetailSection;
