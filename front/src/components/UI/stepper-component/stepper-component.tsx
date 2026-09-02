import { FC } from "react";

import Step from "../../../utils/interfaces/step";
import StepItem from "./step-item";

type Props = {
  actualStep: Step;
  stepsList: Array<Step>;
  updateStep: (id: number) => void;
  disabled?: boolean;
};

const Stepper: FC<Props> = ({ actualStep, stepsList, updateStep, disabled }) => {
  const content = (
    <>
      <ul className="w-full rounded-lg steps">
        {stepsList.map((item: Step) => (
          <StepItem
            key={item.id}
            stepItem={item}
            actualStepId={actualStep.id}
            updateStep={updateStep}
            disabled={disabled}
          />
        ))}
      </ul>
    </>
  );

  return <>{stepsList && stepsList.length > 0 ? <>{content}</> : null}</>;
};

export default Stepper;
