import type { CSSProperties, ReactNode } from "react";

import { INTRO_PYRAMID_LEVELS } from "./intro-levels";
import IntroOrganisationFrame from "./IntroOrganisationFrame";
import IntroLevelPlate from "./IntroLevelPlate";

type Props = {
  activeIndex: number;
  /** Nom de l'organisme, affiché en grand dans le cadre posé derrière la pile. */
  organisationName: string;
  isOrganisationPlaceholder: boolean;
  /** Logo et fond coloré de l'organisme, affichés dans le cadre. */
  logoUrl: string | null;
  backgroundColor?: string;
  /** Teinte des plaques tant que le cadre coloré est visible derrière elles. */
  plateColors: { glass: string; text: string };
  /** Appelé avec l'indice (dans la pyramide) de la plaque cliquée. */
  onSelect: (index: number) => void;
  /** Pile des éléments enfants, posée dans le même repère 3D que les plaques : même caméra par construction. */
  children?: ReactNode;
};

/**
 * Pile de plaques en perspective, l'organisme de formation à plat derrière.
 *
 * Le rail et la carte d'explication portent le même contenu, d'où `aria-hidden` ;
 * les plaques restent cliquables à la souris. La scène anime les éléments `.intro-stack` et
 * `.intro-plate`.
 */
const IntroLevelStack = ({
  activeIndex,
  organisationName,
  isOrganisationPlaceholder,
  logoUrl,
  backgroundColor,
  plateColors,
  onSelect,
  children,
}: Props) => (
  <div
    aria-hidden="true"
    className="grid h-64 w-full place-items-center sm:h-80 lg:h-[24rem] xl:h-[28rem]"
  >
    <div
      style={
        {
          "--intro-glass": plateColors.glass,
          "--intro-plate-text": plateColors.text,
        } as CSSProperties
      }
      className="intro-plate-scope relative h-[500px] w-[700px] translate-y-6 scale-[0.45] [perspective:1500px] sm:scale-[0.62] lg:translate-y-6 lg:scale-[0.7] xl:translate-y-10 xl:scale-[0.8]">
      <IntroOrganisationFrame
        name={organisationName}
        isPlaceholder={isOrganisationPlaceholder}
        logoUrl={logoUrl}
        backgroundColor={backgroundColor}
      />
      <div className="intro-stack absolute left-1/2 top-1/2 size-0 [transform-style:preserve-3d]">
        {/* L'animation d'ouverture incline la pile ici, sans entrer en conflit
            avec l'inclinaison de `.intro-stack` pilotée par le scroll. */}
        <div className="intro-tilt absolute left-0 top-0 size-0 [transform-style:preserve-3d]">
          {INTRO_PYRAMID_LEVELS.map((level, index) => (
            <IntroLevelPlate
              key={level.id}
              level={level}
              index={index}
              isActive={index === activeIndex}
              onSelect={() => onSelect(index)}
            />
          ))}
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default IntroLevelStack;
