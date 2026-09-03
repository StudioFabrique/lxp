import {
  Bed,
  BoomBox,
  Candy,
  Cat,
  Citrus,
  Coffee,
  Dog,
  Gamepad2,
  Ghost,
  Guitar,
  HandMetal,
  MountainSnow,
  Piano,
  Pizza,
  Rabbit,
  Rat,
  Rocket,
  Sailboat,
  Star,
  TentTree,
  Tractor,
  Turtle,
} from "lucide-react";
import { type PropsWithChildren, useEffect, useState } from "react";

import FadeWrapper from "../wrappers/FadeWrapper";

const EMPTY_STATE_ICONS = [
  Coffee,
  Pizza,
  Bed,
  Ghost,
  Cat,
  Dog,
  BoomBox,
  Rocket,
  Gamepad2,
  Star,
  Candy,
  Citrus,
  Tractor,
  Turtle,
  TentTree,
  Sailboat,
  Rat,
  Rabbit,
  Piano,
  MountainSnow,
  Guitar,
  HandMetal,
];

type EmptyStatePlaceholderProps = PropsWithChildren<{
  title: string;
}>;

const EmptyStatePlaceholder = ({
  title,
  children,
}: EmptyStatePlaceholderProps) => {
  const iconClassName = "w-40 h-40 text-primary";
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const updateIcon = window.setTimeout(() => {
      setIconIndex(Math.floor(Math.random() * EMPTY_STATE_ICONS.length));
    }, 0);

    return () => window.clearTimeout(updateIcon);
  }, []);

  const PlaceholderIcon = EMPTY_STATE_ICONS[iconIndex];

  return (
    <div className="select-none shadow-sm bg-base-200 border border-base-300 rounded-lg">
      <FadeWrapper>
        <div className="flex flex-col items-center gap-10 min-h-[50vh] justify-center">
          <PlaceholderIcon className={iconClassName} />
          <div className="flex flex-col items-center gap-5">
            <p className="text-2xl font-bold text-primary">{title}</p>
            {children}
          </div>
        </div>
      </FadeWrapper>
    </div>
  );
};

export default EmptyStatePlaceholder;
