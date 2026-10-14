import { useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import { EllipsisVertical, Menu } from "lucide-react";
import SidebarActionsDrawer from "./SidebarActionsDrawer";
import SidebarDrawer from "./SidebarDrawer";
import SidebarLogo from "./SidebarLogo";
import { getSidebarItemForPath } from "../../config/sidebarItems";
import { cn } from "../../utils/cn";
import { useHasChildElements } from "../../hooks/useHasChildElements";
import { useMobileHeaderActions } from "../../hooks/useMobileHeaderActions";

type Props = {
  interfaceType: string;
  /** Entrées de navigation, reprises à l'identique dans le tiroir. */
  children: ReactNode;
};

/**
 * Barre de navigation du mobile : bouton du menu, section courante et logo, au même style que la
 * barre latérale. Le menu complet s'ouvre dans un tiroir.
 */
const SidebarMobile = ({ interfaceType, children }: Props) => {
  const { pathname } = useLocation();
  // Le tiroir est lié à la page où il a été ouvert : choisir une entrée du menu change de page et le referme.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  // Même principe pour le tiroir d'actions de la page : il n'a de bouton que si l'en-tête y a déposé des actions.
  const [actionsOpenedAt, setActionsOpenedAt] = useState<string | null>(null);
  const actionsOpen = actionsOpenedAt === pathname;
  const headerActions = useMobileHeaderActions();
  const hasActions = useHasChildElements(headerActions?.container ?? null);
  const currentItem = getSidebarItemForPath(pathname);
  const CurrentIcon = currentItem?.icon;

  return (
    <>
      <div className="flex w-full items-center gap-2 rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) p-2 text-(--sidebar-content) shadow-sm transition-colors duration-200">
        <button
          type="button"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-(--sidebar-hover)"
          onClick={() => setOpenedAt(pathname)}
          aria-label="Ouvrir le menu de navigation"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Menu className="size-4" aria-hidden="true" />
        </button>
        <p className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium">
          {CurrentIcon && (
            <CurrentIcon className="size-4 shrink-0" aria-hidden="true" />
          )}
          <span className={cn("truncate", headerActions?.topBarTitle?.className)}>
            {headerActions?.topBarTitle?.text ?? currentItem?.label}
          </span>
        </p>
        <div className="w-16 shrink-0 pr-1">
          <SidebarLogo />
        </div>
        {hasActions && (
          <button
            type="button"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-(--sidebar-hover)"
            onClick={() => setActionsOpenedAt(pathname)}
            aria-label="Ouvrir les actions de la page"
            aria-haspopup="dialog"
            aria-expanded={actionsOpen}
          >
            <EllipsisVertical className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {headerActions && (
        <SidebarActionsDrawer
          open={actionsOpen}
          onClose={() => setActionsOpenedAt(null)}
          setContainer={headerActions.setContainer}
        />
      )}
      <AnimatePresence>
        {open && (
          <SidebarDrawer
            interfaceType={interfaceType}
            onClose={() => setOpenedAt(null)}
          >
            {children}
          </SidebarDrawer>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarMobile;
