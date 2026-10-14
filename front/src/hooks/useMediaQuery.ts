import { useCallback, useSyncExternalStore } from "react";

/** Suit une media query ; vaut `false` quand `matchMedia` n'est pas disponible (tests, rendu serveur). */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (listener: () => void): (() => void) => {
      if (!window.matchMedia) return () => undefined;
      const media = window.matchMedia(query);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(query).matches ?? false,
    () => false,
  );
};

/** Point de rupture `md` de Tailwind : en dessous, la navigation passe en barre du haut et en tiroirs. */
export const useIsMobile = (): boolean => useMediaQuery("(max-width: 767px)");
