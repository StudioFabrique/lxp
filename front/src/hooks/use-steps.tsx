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
    if (id !== 1) {
      if (step && stepsList[id - 2].saved) {
        setActualStep(steps[id - 1]);
      }
    } else {
      setActualStep(steps[0]);
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
      let updatedList = prevStepsList.filter((item) => item.id !== id);
      return sortArray(
        [
          ...updatedList,
          {
            id: step!.id,
            label: step!.label,
            saved: true,
            isValid: value,
          },
        ],
        "id"
      );
    });
    // actualise le step actuel sur le step suivant
    setActualStep(stepsList[id]);
  };

  return { actualStep, stepsList, updateStep, validateStep };
};

export default useSteps;
