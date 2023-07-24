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
  /**
   * condition utilisée pour définir les styles du curseur et des différentes étapes
   * @param id number
   * @returns boolean
   */
  const setIsValid = (id: number) => {
    return id === 1 || stepsList[id - 1].saved || actualStep.id === id;
  };

  /**
   * définit le style d'une étape en fonction de son état
   * @param id number
   * @returns string
   */
  const setStepColor = (id: number) => {
    return setIsValid(id) ? "step-primary" : "step-primary/50";
  };

  /**
   * définit le style du curseur qd il survole une étape en fonction de l'état de cette dernière
   * @param id number
   * @returns boolean
   */
  const setCursor = (id: number) => {
    return setIsValid(id) ? "cursor-pointer" : "cursor-normal";
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
          data-content={item.id}
          className={`step ${setStepColor(item.id)} ${setCursor(item.id)}`}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );

  return <>{content}</>;
};

export default Stepper;
