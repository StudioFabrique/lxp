import { cn } from "../../utils/cn";
import type { IntroLevel } from "./intro-levels";
import { INTRO_PLATE_CLASS } from "./intro-plate-style";

type Props = {
  level: IntroLevel;
  index: number;
  isActive: boolean;
  onSelect: () => void;
};

/** Plus on descend dans la pile, plus la plaque est petite. */
const PLATE_WIDTH = 700;
const PLATE_HEIGHT = 500;
const WIDTH_STEP = 80;
const HEIGHT_STEP = 62;

const IntroLevelPlate = ({ level, index, isActive, onSelect }: Props) => {
  const Icon = level.icon;
  const width = PLATE_WIDTH - index * WIDTH_STEP;
  const height = PLATE_HEIGHT - index * HEIGHT_STEP;

  return (
    // Doublon du rail (qui porte l'accès clavier) : la plaque se clique à la souris.
    <button
      type="button"
      tabIndex={-1}
      onClick={onSelect}
      data-intro-plate={index}
      style={{
        width,
        height,
        left: -width / 2,
        top: -height / 2,
      }}
      className={cn(
        "intro-plate cursor-default",
        INTRO_PLATE_CLASS,
        isActive
          ? "border-primary bg-primary/10"
          : "border-(--intro-glass)/60 hover:border-primary/60",
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
