import type { CSSProperties } from "react";

import { cn } from "../../utils/cn";
import { INTRO_PYRAMID_LEVELS } from "./intro-levels";
import { INTRO_PLATE_CLASS, INTRO_THEME_PLATE_COLORS } from "./intro-plate-style";

type Props = {
  /** Indice, dans la pyramide, de la plaque mise en avant ; -1 tant qu'aucun niveau n'est sélectionné. */
  activeIndex: number;
  /** Nombre de plaques déjà dévoilées, de la plus grande à la plus petite. */
  visibleLevelCount: number;
  onSelect: (index: number) => void;
};

/** Gabarit de la pile, en `cqw` (largeur de son conteneur) : elle s'adapte à tout écran sans mesure en JavaScript. */
const BASE_WIDTH_CQW = 78;
const BASE_HEIGHT_CQW = 52;
const WIDTH_STEP_CQW = 6.4;
const HEIGHT_STEP_CQW = 4.2;
const DEPTH_STEP_CQW = 4.6;

/**
 * Pyramide 3D du mobile : les plaques des niveaux, empilées et vues en perspective, de la plus grande
 * (en bas) à la plus petite. Sans animation scrollée ni mesure : la mise en page de la scène de bureau
 * ne tient pas dans un écran étroit. Chaque plaque est un bouton qui sélectionne son niveau.
 */
const IntroMobilePyramid = ({ activeIndex, visibleLevelCount, onSelect }: Props) => (
  <div className="w-full [container-type:inline-size]">
    <div
      style={
        {
          "--intro-glass": INTRO_THEME_PLATE_COLORS.glass,
          "--intro-plate-text": INTRO_THEME_PLATE_COLORS.text,
        } as CSSProperties
      }
      className="intro-plate-scope relative mx-auto h-[58cqw] max-h-80 w-full [perspective:900px]"
    >
      <div
        className="absolute left-1/2 top-1/2 size-0 [transform-style:preserve-3d]"
        style={{ transform: "translateY(10cqw) rotateX(58deg) rotateZ(-6deg)" }}
      >
        {INTRO_PYRAMID_LEVELS.map((level, index) => {
          const Icon = level.icon;
          const isActive = index === activeIndex;
          return (
            <button
              key={level.id}
              type="button"
              hidden={index >= visibleLevelCount}
              onClick={() => onSelect(index)}
              aria-label={level.label}
              aria-current={isActive ? "step" : undefined}
              data-intro-plate={index}
              style={{
                width: `${BASE_WIDTH_CQW - index * WIDTH_STEP_CQW}cqw`,
                height: `${BASE_HEIGHT_CQW - index * HEIGHT_STEP_CQW}cqw`,
                transform: `translate(-50%, -50%) translateZ(${index * DEPTH_STEP_CQW}cqw)`,
              }}
              className={cn(
                INTRO_PLATE_CLASS,
                "left-0 top-0 cursor-pointer px-2 py-1.5 text-base focus-visible:outline-2 focus-visible:outline-primary",
                isActive
                  ? "border-primary bg-primary/10 ring-2 ring-primary/50"
                  : "border-(--intro-plate-text)/35",
              )}
            >
              <span className="grid size-6 place-items-center rounded-lg bg-primary text-primary-content">
                <Icon className="size-3.5" aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export default IntroMobilePyramid;
