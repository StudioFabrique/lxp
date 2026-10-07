import { createContext } from "react";

export type IntroPresentationContextValue = {
  /** Vrai quand la présentation remplace le contenu de la page. */
  isOpen: boolean;
  isSaving: boolean;
  /** Vrai quand le chatbot de l'application doit laisser la place à celui de la présentation. */
  isChatbotHidden: boolean;
  setChatbotHidden: (hidden: boolean) => void;
  /** Rouvre la présentation (« Revoir la présentation »). */
  open: () => void;
  skip: () => void;
  complete: () => void;
};

export const IntroPresentationContext =
  createContext<IntroPresentationContextValue>({
    isOpen: false,
    isSaving: false,
    isChatbotHidden: false,
    setChatbotHidden: () => {},
    open: () => {},
    skip: () => {},
    complete: () => {},
  });
