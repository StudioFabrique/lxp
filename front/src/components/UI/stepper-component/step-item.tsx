import { FC } from "react";

import Step from "../../../utils/interfaces/step";

type Props = {
  stepItem: Step;
  finalStep: boolean;
  actualStepId: number;
};

const StepItem: FC<Props> = ({ actualStepId, finalStep, stepItem }) => {
  const setStepColor = () => {
    if (stepItem.id < actualStepId && stepItem.isValid) {
      return "step-secondary";
    } else if (stepItem.id === actualStepId) {
      return "step-info";
    }
  };

  const setCursor = () => {
    return finalStep ? "cursor-pointer" : "cursor-normal";
  };

  return (
    <li
      className={`step ${setStepColor()} ${setCursor()}`}
      onClick={() => {}}
      data-content={stepItem.id}
    >
      {stepItem.label}
    </li>
  );
};

export default StepItem;
