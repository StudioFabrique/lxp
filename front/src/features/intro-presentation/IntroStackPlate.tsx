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
  onSelect?: () => void;
  selectionLabel?: string;
  disabled?: boolean;
};

/** Plaque 3D de la pile ; la scène anime les éléments `.intro-layer-plate` et `.intro-child-plate`. */
const IntroStackPlate = ({
  label,
  icon: Icon,
  box,
  variant,
  isActive = false,
  onHoverChange,
  onSelect,
  selectionLabel,
  disabled = false,
}: Props) => {
  // Désactiver le bouton sans remplacer son nœud préserve la profondeur posée par GSAP.
  const Element = onSelect ? "button" : "div";
  return (
    <Element
      type={onSelect ? "button" : undefined}
      onClick={onSelect}
      disabled={onSelect ? disabled : undefined}
      aria-label={onSelect ? selectionLabel : undefined}
      onFocus={onHoverChange ? () => onHoverChange(true) : undefined}
      onBlur={onHoverChange ? () => onHoverChange(false) : undefined}
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
          : "border-(--intro-plate-text)/35",
        // Le dégradé de verre masque la couleur de fond : une couche mise en avant le remplace.
        isActive && variant === "layer" && "from-primary/45 via-primary/30 to-primary/20 ring-4 ring-primary/60 duration-[600ms]",
        !isActive && onSelect && "hover:border-primary",
        onSelect && "cursor-pointer focus-visible:outline-2 focus-visible:outline-primary",
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
    </Element>
  );
};

export default IntroStackPlate;
