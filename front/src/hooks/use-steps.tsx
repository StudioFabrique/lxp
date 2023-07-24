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
    if (step && step.saved) {
      setActualStep(steps[id - 1]);
    }
  };

  /**
   * actualise la valeur du step avec la valeur saved égale à true
   * @param id number
   */
  const saveStep = (id: number) => {
    setStepsList((prevStepsList) => {
      const step = prevStepsList.find((item) => item.id === id);
      let updatedList = prevStepsList.filter((item) => item.id !== id);
      return sortArray(
        [...updatedList, { id: step!.id, label: step!.label, saved: true }],
        "id"
      );
    });
    // actualise le step actuel sur le step suivant
    setActualStep(stepsList[id]);
  };

  return { actualStep, stepsList, saveStep, updateStep };
};

export default useSteps;
