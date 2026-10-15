import { useCallback, useState } from "react";

/**
 * Suit l'exécution d'une action de modale : si elle renvoie une promesse, `isPending` reste vrai jusqu'à sa fin
 * (succès ou échec), pour afficher un loader et désactiver les boutons. Une action synchrone n'a pas d'état d'attente.
 */
export const usePendingAction = () => {
  const [isPending, setIsPending] = useState(false);

  const run = useCallback(async (action?: () => unknown): Promise<void> => {
    const result = action?.();
    if (!(result instanceof Promise)) return;
    setIsPending(true);
    try {
      await result;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { isPending, run };
};
