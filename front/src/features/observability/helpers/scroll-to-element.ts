/** Délai laissé à la page pour finir de changer (section qui s'ouvre, graphique qui se dimensionne) avant de défiler. */
export const SCROLL_DELAY_MS = 250;

/**
 * Fait glisser le haut d'un élément en haut de la zone visible, après un court
 * délai. La cible est calculée à la fin du délai et non au clic : un défilement
 * lancé pendant que la mise en page bouge vise un point périmé et s'arrête à
 * mi-chemin, surtout quand la page est déjà tout en bas et s'allonge sous le
 * clic. Retourne une fonction qui annule le défilement en attente.
 */
export function scrollToElementTop(
  element: HTMLElement | null,
  delayMs: number = SCROLL_DELAY_MS,
): () => void {
  if (!element) return () => {};

  const timer = window.setTimeout(() => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.scrollIntoView?.({
      block: "start",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, delayMs);

  return () => window.clearTimeout(timer);
}
