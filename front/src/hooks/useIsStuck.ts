import { useEffect, useState, type RefObject } from "react";

/**
 * Vrai tant qu'un élément `sticky` est collé en haut de la zone de défilement de l'application.
 * `topOffset` est la valeur de son `top` (en px) : le haut de la zone observée est rogné d'autant
 * (+ 4 px de marge), si bien que l'élément n'est plus entièrement visible dès qu'il se colle.
 * Aucun élément sentinelle : l'élément s'observe lui-même, et ne décale donc pas la mise en page.
 */
export const useIsStuck = (
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  topOffset: number,
): boolean => {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(entry.intersectionRatio < 1),
      {
        root: document.getElementById("main-scroll-container"),
        rootMargin: `-${topOffset + 4}px 0px 0px 0px`,
        threshold: [1],
      },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      setIsStuck(false);
    };
  }, [ref, enabled, topOffset]);

  return enabled && isStuck;
};
