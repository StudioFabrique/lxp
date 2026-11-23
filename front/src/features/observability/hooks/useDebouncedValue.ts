import { useEffect, useState } from "react";

/** Attente après la dernière frappe avant de lancer la recherche. */
export const SEARCH_DEBOUNCE_MS = 400;

/** Ne propage une valeur qu'une fois stable : une requête par recherche, pas une par lettre. */
export function useDebouncedValue<T>(value: T, delayMs: number = SEARCH_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
