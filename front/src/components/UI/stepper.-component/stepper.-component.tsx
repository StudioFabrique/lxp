import { FC } from "react";

import Step from "../../../utils/interfaces/step";
import StepItem from "./step-item";

type Props = {
  actualStep: Step;
  stepsList: Array<Step>;
  updateStep: (id: number) => void;
};

const Stepper: FC<Props> = ({ actualStep, stepsList, updateStep }) => {
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
          <StepItem stepItem={item} actualStepId={actualStep.id} />
        ))}
      </ul>
      {/*       <ul className="w-full flex justify-center bg-slate-500">
        {stepsList.map((item: Step) => (
          <li className="w-full flex items-center bg-yellow-400 ">
            <div className="w-10 h-10 rounded-full bg-pink-400" />
            {item.id < stepsList.length ? (
              <div className="flex-1 h-2 bg-orange-400" />
            ) : null}
          </li>
        ))}
      </ul> */}
    </>
  );

  return <>{stepsList && stepsList.length > 0 ? <>{content}</> : null}</>;
};

export default Stepper;
