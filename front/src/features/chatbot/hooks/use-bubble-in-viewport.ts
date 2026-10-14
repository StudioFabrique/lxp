import { useEffect, type RefObject } from "react";

const MARGIN = 12;

/**
 * Remonte ou descend la bulle de l'assistant virtuel pour qu'elle reste entièrement dans la fenêtre,
 * même quand il est collé au bord bas ou haut. Le décalage est exposé dans `--chatbot-bubble-shift`
 * pour que la pointe de la bulle continue de viser l'assistant. Suivi à chaque image : l'assistant
 * bouge (déplacement, tutoriel) et la hauteur de la bulle change avec son contenu.
 */
export default function useBubbleInViewport(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let shift = 0;
    const fit = (): void => {
      const element = ref.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const top = rect.top - shift;
        const bottom = rect.bottom - shift;
        let next = 0;
        if (bottom > window.innerHeight - MARGIN) next = window.innerHeight - MARGIN - bottom;
        if (top + next < MARGIN) next = MARGIN - top;
        if (next !== shift) {
          shift = next;
          element.style.marginTop = `${next}px`;
          element.style.setProperty("--chatbot-bubble-shift", `${next}px`);
        }
      }
      frame = window.requestAnimationFrame(fit);
    };
    fit();
    return () => window.cancelAnimationFrame(frame);
  }, [ref, active]);
}
