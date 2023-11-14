import { FC } from "react";

import Step from "../../../utils/interfaces/step";
import StepItem from "./step-item";

type Props = {
  actualStep: Step;
  stepsList: Array<Step>;
  finalStep: boolean;
  updateStep: (id: number) => void;
};

const Stepper: FC<Props> = ({
  actualStep,
  finalStep,
  stepsList,
  updateStep,
}) => {
  /**
   * définit le composant affiché à l'écran, si l'étape n'est pas valide aucun changement n'est effectué
   * @param id number
   */
  /*   const handleSwitchSteps = (id: number) => {
    if (id < actualStep.id || id) {
      updateStep(id);
    }
  }; */

  const content = (
    <>
      <ul className="w-full rounded-lg steps">
        {stepsList.map((item: Step) => (
          <StepItem
            key={item.id}
            stepItem={item}
            finalStep={finalStep}
            actualStepId={actualStep.id}
          />
        ))}
      </ul>
    </>
  );

  return <>{stepsList && stepsList.length > 0 ? <>{content}</> : null}</>;
};

export default Stepper;
