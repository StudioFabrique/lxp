import { INTRO_LEVELS } from "./intro-levels";
import IntroLevelPlate from "./IntroLevelPlate";

type Props = {
  activeIndex: number;
};

/**
 * Pile de plaques en perspective, l'organisme à la base.
 *
 * Purement décorative : le rail et la carte d'explication portent le même
 * contenu, d'où `aria-hidden`. La scène anime les éléments `.intro-stack` et
 * `.intro-plate`.
 */
const IntroLevelStack = ({ activeIndex }: Props) => (
  <div
    aria-hidden="true"
    className="grid h-64 w-full place-items-center sm:h-80 lg:h-[24rem] xl:h-[28rem]"
  >
    <div className="relative h-[500px] w-[700px] translate-y-6 scale-[0.45] [perspective:1500px] sm:scale-[0.62] lg:translate-y-6 lg:scale-[0.7] xl:translate-y-10 xl:scale-[0.8]">
      <div className="intro-stack absolute left-1/2 top-1/2 size-0 [transform-style:preserve-3d]">
        {/* L'animation d'ouverture incline la pile ici, sans entrer en conflit
            avec l'inclinaison de `.intro-stack` pilotée par le scroll. */}
        <div className="intro-tilt absolute left-0 top-0 size-0 [transform-style:preserve-3d]">
          {INTRO_LEVELS.map((level, index) => (
            <IntroLevelPlate
              key={level.id}
              level={level}
              index={index}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default IntroLevelStack;
