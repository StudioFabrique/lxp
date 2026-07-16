import { useCallback, useEffect, useState } from "react";

import type Step from "../utils/interfaces/step";
import { sortArray } from "../utils/helpers/sort-array";

const useSteps = (steps: Step[]) => {
  const [actualStep, setActualStep] = useState<Step>(steps[0]);
  const [stepsList, setStepsList] = useState<Array<Step>>(steps);
  const [finalStep, setFinalStep] = useState<boolean>(false);

  const updateStep = useCallback(
    (id: number) => {
      const step = stepsList.find((item: Step) => item.id === id);
      if (step) {
        setActualStep(step);
      }
    },
    [stepsList],
  );

  const validateStep = (id: number, value: boolean) => {
    setStepsList((prevStepsList) =>
      sortArray(
        prevStepsList.map((item) => {
          if (item.id === id) {
            return { ...item, isValid: value };
          }
          return item;
        }),
        "id",
      ),
    );
    if (value) {
      updateStep(id + 1);
    }
  };

  useEffect(() => {
    if (actualStep.id === steps.length) {
      setFinalStep(true);
    }
  }, [actualStep.id, steps]);

  return { actualStep, stepsList, finalStep, updateStep, validateStep };
};

export default useSteps;
