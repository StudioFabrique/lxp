import { useEffect, type RefObject } from "react";
import { useLocation } from "react-router";
import { FIRST_FIELD_SELECTOR } from "./useModalAutoFocus";

// Pages de formulaire : création (`/add`) et édition (`/edit/:id`).
const FORM_PAGE_PATH = /\/(add|edit\/[^/]+)\/?$/;
const WAIT_FOR_FIELD_MS = 3000;

/**
 * À l'arrivée sur une page de formulaire, remonte en haut du conteneur
 * défilant et met le focus sur le premier champ de saisie. Les pages étant
 * chargées à la demande, le champ est attendu jusqu'à son apparition.
 */
export const useFormPageAutoFocus = (
  scrollContainerRef: RefObject<HTMLElement | null>,
): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !FORM_PAGE_PATH.test(pathname)) return;

    container.scrollTo({ top: 0 });

    const focusFirstField = (): boolean => {
      const active = document.activeElement;
      if (active && active !== container && container.contains(active)) {
        return true;
      }
      const field = container.querySelector<HTMLElement>(FIRST_FIELD_SELECTOR);
      if (!field) return false;
      field.focus({ preventScroll: true });
      container.scrollTo({ top: 0 });
      return true;
    };

    if (focusFirstField()) return;

    const observer = new MutationObserver(() => {
      if (focusFirstField()) observer.disconnect();
    });
    observer.observe(container, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), WAIT_FOR_FIELD_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [pathname, scrollContainerRef]);
};
