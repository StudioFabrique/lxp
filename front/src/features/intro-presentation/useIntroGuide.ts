import { useEffect, useState } from "react";

import { GUIDE_STEP_MS } from "./intro-dialogue";

/**
 * Étape du guide du niveau courant : 0 pour le niveau, puis un composant après
 * l'autre. Elle repart de 0 quand `resetKey` change, sans effet de remise à zéro.
 */
export function useIntroGuide(stepCount: number, resetKey: string, enabled: boolean): number {
  const [state, setState] = useState({ key: resetKey, step: 0 });

  useEffect(() => {
    if (!enabled) return;
    const timers = Array.from({ length: Math.max(stepCount - 1, 0) }, (_, index) =>
      setTimeout(
        () => setState({ key: resetKey, step: index + 1 }),
        (index + 1) * GUIDE_STEP_MS,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [stepCount, resetKey, enabled]);

  return state.key === resetKey ? state.step : 0;
}
