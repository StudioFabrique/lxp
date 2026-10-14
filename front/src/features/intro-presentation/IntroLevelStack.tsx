import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { INTRO_PYRAMID_LEVELS } from "./intro-levels";
import { getIntroStackScale } from "./intro-stack-layout";
import IntroOrganisationFrame from "./IntroOrganisationFrame";
import IntroLevelPlate from "./IntroLevelPlate";

type Props = {
  activeIndex: number;
  visibleLevelCount: number;
  /** Nom de l'organisme, affiché en grand dans le cadre posé derrière la pile. */
  organisationName: string;
  /** Logo et fond coloré de l'organisme, affichés dans le cadre. */
  logoUrl: string | null;
  backgroundColor?: string;
  /** Teinte des plaques tant que le cadre coloré est visible derrière elles. */
  plateColors: { glass: string; text: string };
  /** Appelé avec l'indice (dans la pyramide) de la plaque cliquée. */
  onSelect: (index: number) => void;
  /** Décalage horizontal (px) de toute la scène, cadre de l'organisme compris. */
  offsetX?: number;
  /** Pile des éléments enfants, posée dans le même repère 3D que les plaques : même caméra par construction. */
  children?: ReactNode;
};

/**
 * Pile de plaques en perspective, l'organisme de formation à plat derrière.
 *
 * Les plaques permettent de choisir un niveau à la souris comme au clavier.
 * La scène anime les éléments `.intro-stack` et `.intro-plate`.
 */
const IntroLevelStack = ({
  activeIndex,
  visibleLevelCount,
  organisationName,
  logoUrl,
  backgroundColor,
  plateColors,
  onSelect,
  offsetX = 0,
  children,
}: Props) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = (): void => {
      const { width, height } = root.getBoundingClientRect();
      if (width > 0 && height > 0) setScale(getIntroStackScale(width, height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={rootRef}
      // La scène 3D (700 x 500) est posée au centre sans compter dans la mise en page : réduite par
      // `scale`, elle garderait sinon sa taille d'origine et agrandirait la colonne dans une fenêtre courte.
      className="relative h-full min-h-0 w-full"
    >
      <div
        style={
          {
            "--intro-glass": plateColors.glass,
            "--intro-plate-text": plateColors.text,
            transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${70 * scale}px)) scale(${scale})`,
          } as CSSProperties
        }
        className="intro-plate-scope absolute left-1/2 top-1/2 h-[500px] w-[700px] [perspective:1500px]">
        <IntroOrganisationFrame
          name={organisationName}
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
                isVisible={index < visibleLevelCount}
                onSelect={() => onSelect(index)}
              />
            ))}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroLevelStack;
