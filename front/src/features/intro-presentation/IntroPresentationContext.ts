import { createContext } from "react";

/** Étape de la sortie de la barre latérale, qui précède la séquence de l'espace. */
export type SidebarExit = "none" | "leaving" | "gone";

/**
 * État de la barre latérale de l'application : normale, en squelette pendant
 * l'exploration, puis repoussée hors de l'écran avant la séquence de l'espace.
 */
export type SidebarPhase = "normal" | "skeleton" | "leaving" | "gone";

export type IntroPresentationContextValue = {
  /** Vrai quand la présentation remplace le contenu de la page. */
  isOpen: boolean;
  isSaving: boolean;
  /** Vrai pendant la détection du rôle qui suit la présentation. */
  isRoleRevealOpen: boolean;
  sidebarPhase: SidebarPhase;
  setSidebarExit: (exit: SidebarExit) => void;
  /** Vrai quand le chatbot de l'application doit laisser la place à celui de la présentation. */
  isChatbotHidden: boolean;
  setChatbotHidden: (hidden: boolean) => void;
  /** Rouvre la présentation (« Revoir la présentation »). */
  open: () => void;
  skip: () => void;
  complete: () => void;
  closeRoleReveal: () => void;
};

export const IntroPresentationContext =
  createContext<IntroPresentationContextValue>({
    isOpen: false,
    isSaving: false,
    isRoleRevealOpen: false,
    sidebarPhase: "normal",
    setSidebarExit: () => {},
    isChatbotHidden: false,
    setChatbotHidden: () => {},
    open: () => {},
    skip: () => {},
    complete: () => {},
    closeRoleReveal: () => {},
  });
