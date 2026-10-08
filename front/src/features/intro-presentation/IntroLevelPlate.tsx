import { cn } from "../../utils/cn";
import type { IntroLevel } from "./intro-levels";

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
        // Effet verre dépoli : fond translucide, flou de l'arrière-plan,
        // reflet intérieur en haut et fine bordure lumineuse.
        "intro-plate absolute flex cursor-default items-end gap-3.5 rounded-2xl border px-5 py-3 text-2xl text-(--intro-plate-text) backdrop-blur-md outline outline-1 outline-transparent transition-colors [backface-visibility:hidden]",
        "bg-gradient-to-br from-(--intro-glass)/70 via-(--intro-glass)/25 to-(--intro-glass)/10",
        "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--intro-glass)_90%,transparent),inset_0_-12px_24px_color-mix(in_srgb,var(--intro-glass)_20%,transparent),0_20px_40px_color-mix(in_srgb,var(--color-neutral)_12%,transparent)]",
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
