import { useEffect, useState } from "react";

/** Délai au-delà duquel la séquence démarre avec ce qui est déjà chargé. */
const MAX_WAIT_MS = 4000;

/** Vrai quand les données sont chargées ou, au plus tard, après `MAX_WAIT_MS`. */
export const useIntroSpaceReady = (isLoading: boolean): boolean => {
  const [hasWaitedEnough, setHasWaitedEnough] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasWaitedEnough(true), MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  return !isLoading || hasWaitedEnough;
};
