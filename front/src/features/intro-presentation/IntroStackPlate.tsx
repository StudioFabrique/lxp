import type { LucideIcon } from "lucide-react";

import { cn } from "../../utils/cn";
import { INTRO_PLATE_CLASS } from "./intro-plate-style";
import { boxStyle, type StackBox } from "./intro-stack-layout";

type Props = {
  label: string;
  icon: LucideIcon;
  box: StackBox;
  /** « layer » : couche du niveau retenu ; « child » : un élément parmi ceux du niveau, côte à côte. */
  variant: "layer" | "child";
  /** Vrai quand la carte, ou sa ligne dans la liste, est survolée. */
  isActive?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
};

/** Plaque 3D de la pile ; la scène anime les éléments `.intro-layer-plate` et `.intro-child-plate`. */
const IntroStackPlate = ({
  label,
  icon: Icon,
  box,
  variant,
  isActive = false,
  onHoverChange,
}: Props) => (
  // Doublon de la liste de droite, qui porte le contenu accessible : la carte se survole à la souris.
  <div
    data-depth={box.z}
    data-x={box.x}
    data-active={isActive ? "true" : undefined}
    onMouseEnter={onHoverChange ? () => onHoverChange(true) : undefined}
    onMouseLeave={onHoverChange ? () => onHoverChange(false) : undefined}
    style={boxStyle(box)}
    className={cn(
      INTRO_PLATE_CLASS,
      variant === "layer"
        ? "intro-layer-plate"
        : cn(
            "intro-child-plate flex-col items-center justify-center gap-2 px-1",
            // Les dernières couches sont étroites : le texte et l'icône se réduisent.
            box.width < 120 ? "text-xs" : "text-base",
          ),
      isActive
        ? "border-primary bg-primary/10 ring-2 ring-primary/50"
        : "border-(--intro-glass)/60",
      variant === "child" && !isActive && "hover:border-primary/60",
    )}
  >
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-content">
      <Icon className="size-5" aria-hidden="true" />
    </span>
    <b
      className={cn(
        "min-w-0 max-w-full truncate",
        variant === "layer" ? "text-2xl leading-[2.5rem]" : "text-center",
      )}
    >
      {label}
    </b>
  </div>
);

export default IntroStackPlate;
