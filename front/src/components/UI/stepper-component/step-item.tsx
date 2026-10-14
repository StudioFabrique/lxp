import { FC } from "react";

import Step from "../../../utils/interfaces/step";
import { cn } from "../../../utils/cn";

type Props = {
  stepItem: Step;
  actualStepId: number;
  updateStep: (stepId: number) => void;
  disabled?: boolean;
};

const StepItem: FC<Props> = ({
  actualStepId,
  stepItem,
  updateStep,
  disabled = false,
}) => {
  const isActive = stepItem.id <= actualStepId;

  const handleClick = () => {
    updateStep(stepItem.id);
  };

  return (
    <li
      className={cn(
        // Customize line (before) and circle (after)
        "cursor-pointer",
        "hover:after:bg-info after:border-0 after:font-semibold hover:after:text-info-content",
        "step after:content-[counter(step)] [&:first-child::before]:hidden",
        // Sur mobile, seuls les numéros tiennent : les libellés passent sous la barre (voir `Stepper`).
        "before:h-1.5 before:w-full max-md:min-w-0",
        isActive ? "step-primary after:text-primary-content" : undefined,
        stepItem.id === actualStepId && [
          "before:bg-primary",
          "after:bg-info after:text-info-content",
          "cursor-auto",
        ],
        disabled && "pointer-events-none",
      )}
      onClick={disabled ? undefined : handleClick}
      aria-disabled={disabled}
      data-content={stepItem.id}
    >
      <span className="max-md:sr-only">{stepItem.label}</span>
    </li>
  );
};

export default StepItem;
