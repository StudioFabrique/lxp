import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type PropsWithChildren,
} from "react";

type StickyBarStack = {
  /** Déclare l'emplacement d'une barre collante ; renvoie de quoi le retirer. */
  register: (slot: HTMLElement) => () => void;
};

/** Vaut `null` hors de la mise en page de l'application : les barres ne s'effacent alors jamais. */
const StickyBarStackContext = createContext<StickyBarStack | null>(null);

const scrollRoot = (): HTMLElement | null => document.getElementById("main-scroll-container");

/** Ordre d'apparition dans la page. */
const byDocumentPosition = (a: HTMLElement, b: HTMLElement): number =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/** Au-delà de ce seuil, la barre effacée est inerte (ni focus, ni clic). */
const INERT_BELOW_OPACITY = 0.1;

/**
 * Les barres collantes d'une page (en-tête, sous-en-têtes, étapes) se relaient en haut de l'écran : plutôt que de se
 * superposer, une barre collée s'efface progressivement à mesure que la barre suivante, en remontant, la recouvre.
 * Son opacité suit la distance qui les sépare : pleine tant que la suivante est à plus d'une hauteur de barre,
 * nulle quand elle l'a atteinte. L'opacité s'écrit directement sur l'emplacement (pas de rendu React par image).
 */
export function StickyBarStackProvider({ children }: PropsWithChildren) {
  const slots = useRef(new Set<HTMLElement>());
  const frame = useRef<number | undefined>(undefined);

  const update = useCallback(() => {
    frame.current = undefined;
    const rootTop = scrollRoot()?.getBoundingClientRect().top ?? 0;
    const ordered = [...slots.current].sort(byDocumentPosition);

    ordered.forEach((slot, index) => {
      const next = ordered[index + 1];
      const bar = slot.firstElementChild;
      const isStuck = slot.getBoundingClientRect().top <= rootTop + 1;
      let opacity = 1;
      if (next && bar && isStuck) {
        const distance = next.getBoundingClientRect().top - rootTop;
        opacity = Math.min(1, Math.max(0, distance / Math.max(bar.getBoundingClientRect().height, 1)));
      }
      slot.style.opacity = opacity === 1 ? "" : String(opacity);
      if (opacity < INERT_BELOW_OPACITY) slot.setAttribute("inert", "");
      else slot.removeAttribute("inert");
    });
  }, []);

  const schedule = useCallback(() => {
    if (frame.current === undefined) frame.current = requestAnimationFrame(update);
  }, [update]);

  useEffect(() => {
    const root = scrollRoot();
    const target: HTMLElement | Window = root ?? window;
    target.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      target.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      frame.current = undefined;
    };
  }, [schedule]);

  const register = useCallback(
    (slot: HTMLElement) => {
      slots.current.add(slot);
      schedule();
      return () => {
        slots.current.delete(slot);
        slot.style.opacity = "";
        slot.removeAttribute("inert");
        schedule();
      };
    },
    [schedule],
  );

  const value = useMemo(() => ({ register }), [register]);

  return <StickyBarStackContext value={value}>{children}</StickyBarStackContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStickyBarStack = (): StickyBarStack | null => useContext(StickyBarStackContext);
