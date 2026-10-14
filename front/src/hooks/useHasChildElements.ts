import { useCallback, useSyncExternalStore } from "react";

/** Vrai tant que l'élément contient au moins un élément enfant ; suit les ajouts et retraits. */
export const useHasChildElements = (element: HTMLElement | null): boolean => {
  const subscribe = useCallback(
    (listener: () => void): (() => void) => {
      if (!element) return () => undefined;
      const observer = new MutationObserver(listener);
      observer.observe(element, { childList: true });
      return () => observer.disconnect();
    },
    [element],
  );

  return useSyncExternalStore(
    subscribe,
    () => (element?.childElementCount ?? 0) > 0,
    () => false,
  );
};
