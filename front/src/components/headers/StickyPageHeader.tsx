import type { PropsWithChildren, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import { useStickyBar } from "../../hooks/useStickyBar";
import { stickyBarClassName, stickySlotClassName } from "./sticky-bar-styles";
import SidebarRouteIcon from "./SidebarRouteIcon";

type Props = {
  title: ReactNode;
  description?: string;
  /** Icône de la page ; à défaut, celle de la section courante. */
  icon?: LucideIcon;
  /** Classes du titre. */
  titleClassName?: string;
  /** Classes de l'en-tête (marges, empilement). */
  className?: string;
  /** `sub` : sous-en-tête d'une étape (plus compact, sans icône), qui relaie l'en-tête de la page au défilement. */
  variant?: "page" | "sub";
};

/**
 * En-tête de page qui reste accessible au défilement, avec le même effet que `FloatingBottomNavigation`, mais en haut :
 * à sa place, c'est l'en-tête habituel ; dès qu'il atteint le haut de la page, il devient une barre flottante
 * (fond flou, ombre, largeur de la page) qui garde titre, description et actions.
 * L'espace de l'en-tête est conservé pour que le contenu ne bouge pas.
 * Sur mobile, l'en-tête ne se colle pas (ses actions passent dans le tiroir de la barre du haut, voir `Header`).
 */
const StickyPageHeader = ({
  title,
  description,
  icon: Icon,
  titleClassName,
  className,
  variant = "page",
  children,
}: PropsWithChildren<Props>) => {
  const { isStuck, slotRef, barRef, slotHeight } = useStickyBar();
  const isSub = variant === "sub";

  return (
    <div
      ref={slotRef}
      data-testid="sticky-page-header"
      className={cn(stickySlotClassName, className)}
      style={{ height: slotHeight }}
    >
      <div
        ref={barRef}
        data-floating={isStuck}
        className={cn(
          stickyBarClassName(isStuck, "full"),
          "flex flex-wrap items-center justify-between gap-3",
          isSub && !isStuck && "py-2 ring-1 md:py-2",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {!isSub && (Icon ? <Icon aria-hidden className="size-7 shrink-0" /> : <SidebarRouteIcon />)}
          <div>
            <h2 className={cn(isSub ? "text-lg font-bold" : "text-xl font-extrabold", titleClassName)}>{title}</h2>
            {description !== undefined && (
              <p
                className={isSub ? "text-[8.5pt]" : "text-xs"}
              >
                {description}
              </p>
            )}
          </div>
        </div>
        {children && (
          <div className="header-actions header-actions-main flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyPageHeader;
