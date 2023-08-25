import { useEffect, useState } from "react";

import Step from "../utils/interfaces/step";
import { sortArray } from "../utils/sortArray";

const useSteps = (steps: Array<Step>) => {
  const [actualStep, setActualStep] = useState<Step>(steps[0]);
  const [stepsList, setStepsList] = useState<Array<Step>>(steps);
  const [finalStep, setFinalStep] = useState<boolean>(false);

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

  // débloque la navigation libre d'une étape à une autre pour que l'utilisateur puisse apporter des corrections
  useEffect(() => {
    if (actualStep.id === steps.length) {
      setFinalStep(true);
    }
  }, [actualStep.id, steps]);

  return { actualStep, stepsList, finalStep, updateStep, validateStep };
};

export default useSteps;
