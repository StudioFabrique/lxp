import { useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { cn } from "../../utils/cn";
import { useDrawerKeyboard } from "./useDrawerKeyboard";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Reçoit la zone où les en-têtes de page déposent leurs actions. */
  setContainer: (element: HTMLElement | null) => void;
};

/**
 * Tiroir de droite du mobile : les actions de l'en-tête de page, masqué à cet écran. Il reste monté,
 * fermé, pour que les actions gardent leur état et que la barre sache s'il y en a ; l'état fermé
 * le retire de l'affichage, du focus et des lecteurs d'écran.
 */
const SidebarActionsDrawer = ({ open, onClose, setContainer }: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { animations } = useVisualPreferences();

  const handleKeyDown = useDrawerKeyboard({
    active: open,
    panelRef,
    initialFocusRef: closeButtonRef,
    onClose,
  });

  // Choisir une action (lien, bouton, entrée d'un menu déroulant) referme le tiroir une fois l'action déclenchée.
  const handleActionClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a, button")) onClose();
  };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-48",
        open
          ? "visible"
          : "invisible pointer-events-none transition-[visibility] delay-300 motion-reduce:delay-0",
      )}
      inert={!open}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50",
          animations && "transition-opacity duration-300 motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label="Actions de la page"
        className={cn(
          "absolute inset-y-0 right-0 w-[min(20rem,calc(100vw-2rem))] p-2",
          animations &&
            "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Même fond que l'en-tête de page remplacé : les boutons d'action y gardent leurs couleurs. */}
        <section className="themed-page-header flex h-full flex-col gap-4 overflow-y-auto rounded-xl border p-4 text-base-content shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold">Actions de la page</h2>
            <button
              ref={closeButtonRef}
              type="button"
              className="btn btn-ghost btn-sm btn-square"
              onClick={onClose}
              aria-label="Fermer les actions"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div
            ref={setContainer}
            onClick={handleActionClick}
            className="header-actions header-actions-main flex flex-col items-stretch gap-2 [&_.btn]:w-full"
          />
        </section>
      </div>
    </div>,
    document.body,
  );
};

export default SidebarActionsDrawer;
