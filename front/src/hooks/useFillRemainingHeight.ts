import { useLayoutEffect, type RefObject } from "react";

const MAIN_SELECTOR = "#main-scroll-container";
const CONTENT_SELECTOR = "[data-page-content]";

/**
 * Étire l'élément jusqu'en bas de la zone de contenu (sous les en-têtes et cartes qui le précèdent),
 * sans jamais produire de défilement : la hauteur minimale est mesurée, pas estimée.
 * `minHeight` CSS du composant reste le plancher quand l'espace restant est plus petit.
 * @param ref élément à étirer
 * @param bottomInset espace à laisser sous l'élément (marge et bordure du parent)
 */
export function useFillRemainingHeight(
  ref: RefObject<HTMLElement | null>,
  bottomInset = 0,
) {
  useLayoutEffect(() => {
    const element = ref.current;
    const main = element?.closest<HTMLElement>(MAIN_SELECTOR);
    if (!element || !main) return;

    const content = main.querySelector<HTMLElement>(CONTENT_SELECTOR);
    const update = () => {
      element.style.minHeight = "";
      const top =
        element.getBoundingClientRect().top -
        main.getBoundingClientRect().top +
        main.scrollTop;
      const contentBottomMargin = content
        ? Number.parseFloat(getComputedStyle(content).marginBottom) || 0
        : 0;
      const available = main.clientHeight - top - contentBottomMargin - bottomInset;
      const current = element.getBoundingClientRect().height;
      if (available > current) element.style.minHeight = `${Math.floor(available)}px`;
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(main);
    if (content) observer.observe(content);
    return () => observer.disconnect();
  }, [ref, bottomInset]);
}
