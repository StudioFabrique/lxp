import { FC } from "react";

import Step from "../../../utils/interfaces/step";

type Props = {
  stepItem: Step;
  finalStep: boolean;
  actualStepId: number;
};

const StepItem: FC<Props> = ({ actualStepId, finalStep, stepItem }) => {
  /**
   * définit le style du stepper en fonction de ses propriétés
   * @param id number
   * @returns string
   */
  const setStepColor = () => {
    if (stepItem.id < actualStepId && stepItem.isValid) {
      return "step-primary";
    } else if (stepItem.id === actualStepId) {
      return "step-accent";
    }
  };

  /**
   * définit le style du curseur qd il survole une étape en fonction de l'état de cette dernière
   * @param id number
   * @returns boolean
   */
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

/* "&#9773;" */
