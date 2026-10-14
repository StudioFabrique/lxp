import { useEffect, type RefObject } from "react";
import { useLocation } from "react-router";
import { FIRST_FIELD_SELECTOR } from "./useModalAutoFocus";

// Pages de formulaire : création (`/add`) et édition (`/edit/:id`).
const FORM_PAGE_PATH = /\/(add|edit\/[^/]+)\/?$/;
// Édition de parcours : la page est longue, le premier champ est centré en douceur.
const CENTERED_PAGE_PATH = /\/parcours\/edit\/[^/]+\/?$/;
// Étape « Informations » de l'édition de parcours : seule étape concernée par le focus.
const FIRST_STEP = "1";
const WAIT_FOR_FIELD_MS = 3000;
// La page se construit progressivement (chargement à la demande, images) :
// le centrage attend que la mise en page soit stable avant de défiler.
const LAYOUT_SETTLE_MS = 250;
const USER_SCROLL_EVENTS = ["wheel", "touchmove", "keydown", "pointerdown"];

const centerInContainer = (
  container: HTMLElement,
  field: HTMLElement,
  smooth: boolean,
): void => {
  const containerRect = container.getBoundingClientRect();
  const fieldRect = field.getBoundingClientRect();
  const delta =
    fieldRect.top +
    fieldRect.height / 2 -
    (containerRect.top + container.clientHeight / 2);
  container.scrollTo({
    top: container.scrollTop + delta,
    behavior: smooth ? "smooth" : "auto",
  });
};

/**
 * À l'arrivée sur une page de formulaire, remonte en haut du conteneur
 * défilant et met le focus sur le premier champ de saisie (centré à l'écran
 * pour l'édition de parcours). Les pages étant chargées à la demande, le champ
 * est attendu jusqu'à son apparition.
 */
export const useFormPageAutoFocus = (
  scrollContainerRef: RefObject<HTMLElement | null>,
): void => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !FORM_PAGE_PATH.test(pathname)) return;

    const centerField = CENTERED_PAGE_PATH.test(pathname);
    // Une redirection vers une autre étape (ex. `?step=4&moduleId=…`) gère son
    // propre défilement : ne pas le contrarier.
    const requestedStep = new URLSearchParams(search).get("step");
    if (centerField && requestedStep && requestedStep !== FIRST_STEP) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    let focusedField: HTMLElement | null = null;
    let settleTimer: number | undefined;
    let userHasScrolled = false;

    container.scrollTo({ top: 0 });

    const scheduleCentering = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (focusedField && !userHasScrolled) {
          centerInContainer(container, focusedField, smooth);
        }
      }, LAYOUT_SETTLE_MS);
    };

    const focusFirstField = (): boolean => {
      const active = document.activeElement;
      if (active && active !== container && container.contains(active)) {
        return true;
      }
      const field = container.querySelector<HTMLElement>(FIRST_FIELD_SELECTOR);
      if (!field) return false;
      field.focus({ preventScroll: true });
      if (centerField) {
        focusedField = field;
        scheduleCentering();
      } else {
        container.scrollTo({ top: 0 });
      }
      return true;
    };

    const markUserScroll = () => {
      userHasScrolled = true;
    };

    const observer = new MutationObserver(() => {
      if (!focusedField) {
        if (focusFirstField() && !centerField) observer.disconnect();
      } else {
        scheduleCentering();
      }
    });

    const alreadyFocused = focusFirstField();
    if (!alreadyFocused || centerField) {
      observer.observe(container, { childList: true, subtree: true });
    }
    if (centerField) {
      USER_SCROLL_EVENTS.forEach((type) =>
        window.addEventListener(type, markUserScroll, { passive: true }),
      );
    }
    const stopTimer = window.setTimeout(
      () => observer.disconnect(),
      WAIT_FOR_FIELD_MS,
    );

    return () => {
      observer.disconnect();
      window.clearTimeout(stopTimer);
      window.clearTimeout(settleTimer);
      USER_SCROLL_EVENTS.forEach((type) =>
        window.removeEventListener(type, markUserScroll),
      );
    };
    // `search` est lu à l'arrivée seulement : un changement d'étape ne relance pas l'effet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, scrollContainerRef]);
};
