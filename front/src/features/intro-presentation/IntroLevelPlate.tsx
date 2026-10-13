import { cn } from "../../utils/cn";
import type { IntroLevel } from "./intro-levels";
import { INTRO_PLATE_CLASS } from "./intro-plate-style";

type Props = {
  level: IntroLevel;
  index: number;
  isActive: boolean;
  isVisible: boolean;
  onSelect: () => void;
};

/** Plus on descend dans la pile, plus la plaque est petite. */
const PLATE_WIDTH = 700;
const PLATE_HEIGHT = 500;
const WIDTH_STEP = 80;
const HEIGHT_STEP = 62;

const IntroLevelPlate = ({ level, index, isActive, isVisible, onSelect }: Props) => {
  const Icon = level.icon;
  const width = PLATE_WIDTH - index * WIDTH_STEP;
  const height = PLATE_HEIGHT - index * HEIGHT_STEP;

  return (
    // Chaque plaque permet aussi la navigation au clavier.
    <button
      type="button"
      hidden={!isVisible}
      onClick={onSelect}
      data-intro-plate={index}
      style={{
        width,
        height,
        left: -width / 2,
        top: -height / 2,
      }}
      className={cn(
        "intro-plate cursor-pointer focus-visible:outline-2 focus-visible:outline-primary",
        INTRO_PLATE_CLASS,
        isActive
          ? "border-primary bg-primary/10"
          : "border-(--intro-plate-text)/35 hover:border-primary",
      )}
    >
      <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-content">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <b className="whitespace-nowrap leading-[2.75rem]">{level.label}</b>
    </button>
  );
};

export default IntroLevelPlate;
