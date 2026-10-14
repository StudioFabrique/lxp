import { useEffect, type KeyboardEvent, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Options = {
  /** Faux tant que le tiroir est fermé : ni focus ni raccourcis. */
  active: boolean;
  panelRef: RefObject<HTMLElement | null>;
  initialFocusRef: RefObject<HTMLElement | null>;
  onClose: () => void;
};

/**
 * Clavier d'un tiroir modal : le focus y entre à l'ouverture et revient à l'élément qui l'avait à la
 * fermeture, Échap le ferme et Tab reste à l'intérieur. À brancher sur `onKeyDown` du tiroir.
 */
export const useDrawerKeyboard = ({ active, panelRef, initialFocusRef, onClose }: Options) => {
  useEffect(() => {
    if (!active) return;
    const opener = document.activeElement as HTMLElement | null;
    initialFocusRef.current?.focus();
    return () => opener?.focus();
  }, [active, initialFocusRef]);

  return (event: KeyboardEvent<HTMLElement>): void => {
    // Une carte ouverte depuis le tiroir (profil) consomme d'abord Échap.
    if (event.key === "Escape" && !event.defaultPrevented) {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
};
