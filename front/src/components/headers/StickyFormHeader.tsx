import { useLayoutEffect, useRef, useState, type PropsWithChildren } from "react";
import { cn } from "../../utils/cn";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useIsStuck } from "../../hooks/useIsStuck";
import { formatTitle } from "../../utils/helpers/text-helpers";
import Header from "./Header";
import SidebarRouteIcon from "./SidebarRouteIcon";

type Props = {
  title: string;
  description?: string;
};

/** Valeur du `top-4` de l'en-tête collé, en px. */
const STICKY_TOP = 16;

/**
 * En-tête d'un formulaire (titre et actions « Annuler » / « Sauvegarder ») qui reste accessible au défilement.
 * Même effet que `FloatingBottomNavigation`, mais en haut : à sa place, c'est l'en-tête habituel ; dès qu'il atteint
 * le haut de la page, il devient une barre flottante (fond flou, ombre, 60 % de la largeur) qui ne garde que le titre
 * et les actions. L'espace de l'en-tête est conservé pour que le contenu ne bouge pas.
 * Sur mobile, l'en-tête habituel est conservé : ses actions passent dans le tiroir de la barre du haut.
 */
const StickyFormHeader = ({ title, description, children }: PropsWithChildren<Props>) => {
  const isMobile = useIsMobile();
  const slotRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const isStuck = useIsStuck(slotRef, !isMobile, STICKY_TOP);
  // Hauteur de l'en-tête déployé, retenue pour que l'emplacement ne rétrécisse pas quand il se réduit.
  const [slotHeight, setSlotHeight] = useState<number>();
  const isStuckRef = useRef(isStuck);

  useLayoutEffect(() => {
    isStuckRef.current = isStuck;
  }, [isStuck]);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (isMobile || !bar || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (!isStuckRef.current) setSlotHeight(entry.borderBoxSize[0]?.blockSize ?? bar.offsetHeight);
    });
    observer.observe(bar);
    return () => observer.disconnect();
  }, [isMobile]);

  if (isMobile) {
    return (
      <Header title={title} description={description}>
        {children}
      </Header>
    );
  }

  return (
    <div
      ref={slotRef}
      data-testid="sticky-form-header"
      className="pointer-events-none sticky top-4 z-30"
      style={{ height: slotHeight }}
    >
      <div
        ref={barRef}
        data-floating={isStuck}
        className={cn(
          "pointer-events-auto mx-auto flex flex-wrap items-center justify-between gap-3 border p-3 select-none md:p-4",
          "transition-all duration-500 ease-in-out motion-reduce:transition-none",
          isStuck
            ? "w-[60vw] rounded-2xl border-base-300 bg-base-200/90 shadow-xl backdrop-blur"
            : "themed-page-header w-full rounded-lg shadow-none",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <SidebarRouteIcon />
          <div>
            <h2 className="text-xl font-extrabold">{formatTitle(title)}</h2>
            <p
              className={cn(
                "overflow-hidden text-xs transition-all duration-500 ease-in-out motion-reduce:transition-none",
                isStuck ? "max-h-0 opacity-0" : "max-h-10",
              )}
            >
              {description}
            </p>
          </div>
        </div>
        <div className="header-actions header-actions-main flex min-w-0 items-center gap-2">{children}</div>
      </div>
    </div>
  );
};

export default StickyFormHeader;
