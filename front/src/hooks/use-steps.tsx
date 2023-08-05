import { useState } from "react";

import Step from "../utils/interfaces/step";
import { sortArray } from "../utils/sortArray";

const useSteps = (steps: Array<Step>) => {
  const [actualStep, setActualStep] = useState<Step>(steps[0]);
  const [stepsList, setStepsList] = useState<Array<Step>>(steps);

  /**
   * définit le step actuel pour afficher le composant correspondant dans la vue
   * @param id number
   */
  const updateStep = (id: number) => {
    const step = stepsList.find((item: Step) => item.id === id);
    if (step) {
      setActualStep(step);
    }
  };

  /**
   * actualise les propriétés saved et isValid de l'étape correspondant à l'id envoyée
   * @param id number
   * @param value boolean
   */
  const validateStep = (id: number, value: boolean) => {
    setStepsList((prevStepsList) => {
      const step = prevStepsList.find((item) => item.id === id);
      const updatedList = prevStepsList.filter((item) => item.id !== id);
      return sortArray(
        [
          ...updatedList,
          {
            id: step!.id,
            label: step!.label,
            isValid: value,
          },
        ],
        "id"
      );
    });
  };

  return { actualStep, stepsList, updateStep, validateStep };
};

export default useSteps;
