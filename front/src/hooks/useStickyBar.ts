import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIsMobile } from "./useMediaQuery";
import { useIsStuck } from "./useIsStuck";
import { useStickyBarStack } from "../components/headers/sticky-bar-stack";

/** Une barre collée touche le haut de la zone de défilement (`top-0`). */
const STICKY_TOP = 0;

/** Durée de la transition de la barre (300 ms, plus 100 ms de décalage du fondu) et marge : la barre n'est mesurable qu'une fois stabilisée. */
const TRANSITION_SETTLE_MS = 600;

/**
 * Mécanique commune des barres qui se collent en haut de la page puis se transforment en barre flottante :
 * `slotRef` va sur l'emplacement (`sticky`), `barRef` sur la barre qui change d'aspect.
 * L'emplacement garde la hauteur de la barre déployée (`slotHeight`) pour que le contenu en dessous ne bouge pas.
 * Rien ne se colle sur mobile (`isMobile`).
 * La hauteur n'est mesurée que sur la barre déployée et stable : pendant la transition, la barre change de
 * taille à chaque image, et la suivre ferait sauter le contenu en dessous.
 */
export const useStickyBar = () => {
  const isMobile = useIsMobile();
  const slotObjectRef = useRef<HTMLDivElement | null>(null);
  const [slotElement, setSlotElement] = useState<HTMLDivElement | null>(null);
  // Ref à donner à l'emplacement : l'élément est aussi gardé en état pour se situer parmi les autres barres collées.
  const slotRef = useCallback((element: HTMLDivElement | null) => {
    slotObjectRef.current = element;
    setSlotElement(element);
  }, []);
  const barRef = useRef<HTMLDivElement>(null);
  const isStuck = useIsStuck(slotObjectRef, !isMobile, STICKY_TOP);
  const [slotHeight, setSlotHeight] = useState<number>();
  const isStuckRef = useRef(isStuck);
  const settledAtRef = useRef(0);
  const hasChangedRef = useRef(false);

  useLayoutEffect(() => {
    isStuckRef.current = isStuck;
    // Le premier rendu n'est pas une transition : la barre se mesure aussitôt.
    if (hasChangedRef.current || isStuck) {
      hasChangedRef.current = true;
      settledAtRef.current = Date.now() + TRANSITION_SETTLE_MS;
    }
  }, [isStuck]);

  // Les barres collantes de la page se relaient : celle-ci s'efface à mesure qu'une suivante la recouvre.
  const stack = useStickyBarStack();
  const registerInStack = stack?.register;
  useEffect(() => {
    if (isMobile || !slotElement || !registerInStack) return;
    return registerInStack(slotElement);
  }, [isMobile, slotElement, registerInStack]);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (isMobile || !bar || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (!isStuckRef.current && Date.now() >= settledAtRef.current) setSlotHeight(entry.borderBoxSize[0]?.blockSize ?? bar.offsetHeight);
    });
    observer.observe(bar);
    return () => observer.disconnect();
  }, [isMobile]);

  return { isMobile, isStuck, slotRef, barRef, slotHeight: isMobile ? undefined : slotHeight };
};
