import { useEffect, type RefObject } from "react";

export const FIRST_FIELD_SELECTOR = [
  'input:not([type="hidden"]):not([type="file"]):not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([disabled]):not([readonly])',
  "textarea:not([disabled]):not([readonly])",
  "select:not([disabled])",
].join(",");

/**
 * Met le focus sur le premier champ de saisie d'une modale à son ouverture,
 * sauf si un élément de la modale a déjà pris le focus (ex. `autoFocus`).
 */
export const useModalAutoFocus = (
  containerRef: RefObject<HTMLElement | null>,
): void => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const active = document.activeElement;
    if (active && active !== container && container.contains(active)) return;

    container.querySelector<HTMLElement>(FIRST_FIELD_SELECTOR)?.focus();
  }, [containerRef]);
};
