import { useEffect, useState } from "react";

import { dialogueSchedule } from "./intro-dialogue";

/**
 * Indice du message courant : on passe au suivant une fois le précédent lu.
 * `messages` doit garder la même identité d'un rendu à l'autre.
 */
export function useIntroDialogueStep(messages: readonly string[]): number {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = dialogueSchedule(messages).map((start, index) =>
      index === 0 ? undefined : setTimeout(() => setStep(index), start),
    );
    return () => timers.forEach(clearTimeout);
  }, [messages]);

  return step;
}
