import { cn } from "../../utils/cn";
import type { IntroLevel } from "./intro-levels";

type Props = {
  level: IntroLevel;
  index: number;
  isActive: boolean;
};

/** Plus on descend dans la pile, plus la plaque est petite. */
const PLATE_WIDTH = 700;
const PLATE_HEIGHT = 500;
const WIDTH_STEP = 80;
const HEIGHT_STEP = 62;

const IntroLevelPlate = ({ level, index, isActive }: Props) => {
  const Icon = level.icon;
  const width = PLATE_WIDTH - index * WIDTH_STEP;
  const height = PLATE_HEIGHT - index * HEIGHT_STEP;

  return (
    <div
      data-intro-plate={index}
      style={{
        width,
        height,
        left: -width / 2,
        top: -height / 2,
      }}
      className={cn(
        "intro-plate absolute flex items-end gap-3.5 rounded-2xl border px-5 py-3 text-2xl text-base-content shadow-[0_9px_0_var(--color-base-300),0_30px_50px_color-mix(in_srgb,var(--color-neutral)_10%,transparent)] transition-colors [backface-visibility:hidden]",
        isActive
          ? "border-primary bg-base-100"
          : "border-base-300 bg-base-200",
      )}
    >
      <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-content">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <b className="whitespace-nowrap leading-[2.75rem]">{level.label}</b>
    </div>
  );
};

export default IntroLevelPlate;
