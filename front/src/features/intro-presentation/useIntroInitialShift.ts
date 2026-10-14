import { useSyncExternalStore } from "react";

/** Décalage initial vers la gauche (en px) de la pyramide et des repères du bas : 6rem, soit `-translate-x-24`. */
const WIDE_SHIFT_PX = 96;
const WIDE_QUERY = "(min-width: 1024px)";

/** Vrai à partir du point de rupture `lg` : la scène est sur deux colonnes et le détail du niveau se pose à droite de la pyramide. */
export const isWideScreen = (): boolean =>
  typeof window !== "undefined" && window.matchMedia?.(WIDE_QUERY).matches === true;

/** Sous le point de rupture `lg`, la scène tient sur une colonne : aucun décalage latéral. */
export const getIntroInitialShift = (): number => (isWideScreen() ? WIDE_SHIFT_PX : 0);

const subscribe = (onChange: () => void): (() => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => undefined;
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export const useIntroInitialShift = (): number =>
  useSyncExternalStore(subscribe, getIntroInitialShift, () => 0);
