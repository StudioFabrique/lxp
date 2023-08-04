import { FC } from "react";

import Step from "../../../utils/interfaces/step";

type Props = {
  stepItem: Step;
  actualStepId: number;
};

const StepItem: FC<Props> = ({ actualStepId, stepItem }) => {
  /**
   * définit le style du stepper en fonction de ses propriétés
   * @param id number
   * @returns string
   */
  const setStepColor = () => {
    if (stepItem.id === actualStepId) {
      return "step-primary";
    }
    if (stepItem.isValid) {
      return "step-primary";
    }
  };

  /**
   * définit le style du curseur qd il survole une étape en fonction de l'état de cette dernière
   * @param id number
   * @returns boolean
   */
  const setCursor = () => {
    return stepItem.isValid /*  || stepsList[id - 2].saved */
      ? "cursor-pointer"
      : "cursor-normal";
  };

  return (
    <li
      className={`step ${setStepColor()} ${setCursor()}`}
      onClick={() => {}}
      key={stepItem.id}
      data-content="&#9773;"
    >
      {stepItem.label}
    </li>
  );
};

export default StepItem;
