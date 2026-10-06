import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export const authIntroDurationMs = 3600;

/** Show the centered brand once before revealing an onboarding welcome. */
export function useAuthIntro(enabled: boolean): boolean {
  const reducedMotion = useReducedMotion();
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!enabled || reducedMotion || finished) return;
    const timer = window.setTimeout(() => setFinished(true), authIntroDurationMs);
    return () => window.clearTimeout(timer);
  }, [enabled, reducedMotion, finished]);
  return enabled && !reducedMotion && !finished;
}
