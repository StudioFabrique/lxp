const KEY = "andria:intro-first-run";

/**
 * Au rechargement, l'écran de chargement s'affiche avant que le compte soit
 * connu. Cet indice, écrit par `IntroPresentationProvider`, lui dit ce qu'il
 * peut dessiner : la barre réduite de la première présentation, la colonne
 * habituelle, ou rien tant qu'on l'ignore (nouveau navigateur).
 */
export const setIntroFirstRunHint = (isFirstRun: boolean): void => {
  try {
    localStorage.setItem(KEY, isFirstRun ? "1" : "0");
  } catch {
    // Stockage indisponible : l'indice reste inconnu.
  }
};

/** `null` quand l'état du compte n'a encore jamais été vu par ce navigateur. */
export const readIntroFirstRunHint = (): boolean | null => {
  try {
    const value = localStorage.getItem(KEY);
    return value === null ? null : value === "1";
  } catch {
    return null;
  }
};
