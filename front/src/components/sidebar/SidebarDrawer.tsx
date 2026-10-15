import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import SidebarWrapper from "./SidebarWrapper";
import { SidebarDisplayContext } from "./sidebar-display";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { useDrawerKeyboard } from "./useDrawerKeyboard";

type Props = {
  interfaceType: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Menu de navigation du mobile : le même contenu que la barre latérale, déployé avec ses libellés
 * dans un tiroir à gauche. Rendu dans le `body` pour passer au-dessus de l'assistant virtuel, mais
 * sous les cartes (profil, consommation IA) qui s'ouvrent depuis lui.
 */
const SidebarDrawer = ({ interfaceType, onClose, children }: Props) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const { animations } = useVisualPreferences();
  const instant = reduceMotion || !animations;

  const handleKeyDown = useDrawerKeyboard({
    active: true,
    panelRef,
    initialFocusRef: closeButtonRef,
    onClose,
  });

  return createPortal(
    <div className="fixed inset-0 z-48" onKeyDown={handleKeyDown}>
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: instant ? 0 : 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        // Largeur en vw : le menu suit la taille de l'écran (et le nombre de cartes par ligne avec lui), plafonnée sur tablette.
        className="absolute inset-y-0 left-0 w-[90vw] max-w-md p-2"
        initial={{ x: instant ? 0 : "-105%" }}
        animate={{ x: 0 }}
        exit={{ x: instant ? 0 : "-105%" }}
        transition={{ duration: instant ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <SidebarDisplayContext.Provider value={{ expanded: true }}>
          <SidebarWrapper interfaceType={interfaceType} variant="drawer">
            {children}
          </SidebarWrapper>
        </SidebarDisplayContext.Provider>
        <button
          ref={closeButtonRef}
          type="button"
          className="absolute right-6 top-6 flex size-8 cursor-pointer items-center justify-center rounded-lg text-(--sidebar-content) transition-colors hover:bg-(--sidebar-hover)"
          onClick={onClose}
          aria-label="Fermer le menu"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </motion.div>
    </div>,
    document.body,
  );
};

export default SidebarDrawer;
