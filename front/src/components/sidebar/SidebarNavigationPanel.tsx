import { useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useVisualPreferences } from "../../store/VisualPreferences";
import { useDrawerKeyboard } from "./useDrawerKeyboard";

type Props = {
  label: string;
  onClose: () => void;
  /** Reçoit la zone où la page dépose son contenu. */
  setContainer: (element: HTMLElement | null) => void;
};

/**
 * Panneau plein écran du mobile, ouvert depuis le bouton central de la barre du haut. Il n'existe que
 * tant qu'il est ouvert : la page y dépose son contenu (portail) et le retrouve à chaque ouverture.
 */
const SidebarNavigationPanel = ({ label, onClose, setContainer }: Props) => {
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
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-48 flex flex-col gap-2 bg-base-100 p-2 text-base-content"
      initial={{ opacity: 0, y: instant ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: instant ? 0 : 24 }}
      transition={{ duration: instant ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      onKeyDown={handleKeyDown}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) p-2 text-(--sidebar-content) shadow-sm">
        <h2 className="min-w-0 truncate pl-2 text-sm font-medium">{label}</h2>
        <button
          ref={closeButtonRef}
          type="button"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-(--sidebar-hover)"
          onClick={onClose}
          aria-label="Fermer la navigation"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div ref={setContainer} className="min-h-0 flex-1 overflow-y-auto" />
    </motion.div>,
    document.body,
  );
};

export default SidebarNavigationPanel;
