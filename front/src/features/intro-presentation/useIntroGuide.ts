import { useCallback, useState } from "react";

export type IntroGuide = {
  /** Rang du message courant, à partir de 0. */
  step: number;
  /** Absent au premier message. */
  previous?: () => void;
  /** Absent au dernier message. */
  next?: () => void;
};

/**
 * Suite de messages de l'assistant virtuel, lue à la demande avec « Précédent » et « Suivant » : rien ne
 * défile seul. Elle repart du premier message quand `resetKey` change, sans effet de remise à zéro.
 */
export function useIntroGuide(stepCount: number, resetKey: string): IntroGuide {
  const [state, setState] = useState({ key: resetKey, step: 0 });
  const step = Math.min(state.key === resetKey ? state.step : 0, Math.max(stepCount - 1, 0));

  const previous = useCallback(() => setState({ key: resetKey, step: step - 1 }), [resetKey, step]);
  const next = useCallback(() => setState({ key: resetKey, step: step + 1 }), [resetKey, step]);

  return {
    step,
    previous: step > 0 ? previous : undefined,
    next: step + 1 < stepCount ? next : undefined,
  };
}
