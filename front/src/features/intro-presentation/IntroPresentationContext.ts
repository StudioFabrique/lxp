import { createContext } from "react";

/**
 * État de la barre latérale de l'application : normale, réduite en barre pendant
 * la présentation sur mobile, ou masquée pendant la découverte du rôle.
 */
export type SidebarPhase = "normal" | "skeleton" | "gone";

export type IntroPresentationContextValue = {
  /** Vrai quand la présentation remplace le contenu de la page. */
  isOpen: boolean;
  isSaving: boolean;
  /** Vrai pendant la détection du rôle qui suit la présentation. */
  isRoleRevealOpen: boolean;
  /** Vrai un court instant après la découverte du rôle : l'interface réelle se substitue à la séquence. */
  hasJustRevealed: boolean;
  sidebarPhase: SidebarPhase;
  /** Vrai quand l’assistant virtuel de l'application doit laisser la place à celui de la présentation. */
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
    hasJustRevealed: false,
    sidebarPhase: "normal",
    isChatbotHidden: false,
    setChatbotHidden: () => {},
    open: () => {},
    skip: () => {},
    complete: () => {},
    closeRoleReveal: () => {},
  });
