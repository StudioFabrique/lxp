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
        "min-h-12 md:min-h-auto md:before:h-1.5",
        "before:w-1.5 md:before:w-full",
        isActive ? "step-secondary" : undefined,
        stepItem.id === actualStepId && [
          "before:bg-secondary",
          "after:bg-info",
          "cursor-auto",
        ],
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
      )}
      onClick={disabled ? undefined : handleClick}
      aria-disabled={disabled}
      data-content={stepItem.id}
    >
      {stepItem.label}
    </li>
  );
};

export default StepItem;
