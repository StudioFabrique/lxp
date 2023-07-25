import { FC } from "react";

import Step from "../../../utils/interfaces/step";
import { stepsParcours } from "../../../config/steps/steps-parcours";

type Props = {
  actualStep: Step;
  stepsList: Array<Step>;
  updateStep: (id: number) => void;
};

const steps = stepsParcours;

const Stepper: FC<Props> = ({ actualStep, stepsList, updateStep }) => {
  console.log("stepper rendering...");

  /**
   * définit le style du stepper en fonction de ses propriétés
   * @param id number
   * @returns string
   */
  const setStepColor = (id: number) => {
    const step = stepsList.find((item) => item.id === id);
    if (step) {
      if (step.id === actualStep.id) {
        return "step-accent";
      }
      if (step.saved && step.isValid) {
        return "step-primary";
      }
      if (step.saved && !actualStep.isValid) {
        return "step-warning";
      }
    }
  };

  /**
   * définit le style du curseur qd il survole une étape en fonction de l'état de cette dernière
   * @param id number
   * @returns boolean
   */
  const setCursor = (id: number) => {
    const step = stepsList.find((item) => item.id === id);
    if (step) {
      return step.saved /*  || stepsList[id - 2].saved */
        ? "cursor-pointer"
        : "cursor-normal";
    }
  };

  /**
   * définit le composant affiché à l'écran, si l'étape n'est pas valide aucun changement n'est effectué
   * @param id number
   */
  const handleSwitchSteps = (id: number) => {
    updateStep(id);
  };

  let content = (
    <ul className="w-full steps">
      {steps.map((item: Step) => (
        <li
          onClick={() => handleSwitchSteps(item.id)}
          key={item.id}
          data-content="&#9773;"
          className={`step ${setStepColor(item.id)} ${setCursor(item.id)}`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );

  console.log({ stepsList });

  return <>{stepsList && stepsList.length > 0 ? <>{content}</> : null}</>;
};

export default Stepper;
