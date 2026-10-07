import { createContext, type ReactNode, type RefObject } from "react";

/** Réponses d’aide propres à l’étape ; sans valeur, les réponses génériques s’appliquent. */
export type ChatbotHelp = { action?: ReactNode; next?: ReactNode; back?: ReactNode };

export type ChatbotStep = {
  message?: ReactNode;
  help?: ChatbotHelp;
  compact?: boolean;
  delay?: number;
  scopeRef: RefObject<HTMLDivElement | null>;
  stepId: string;
};

export type ChatbotHost = {
  register: (step: ChatbotStep) => void;
  /** Retire l'étape si elle est toujours la courante : une étape plus récente n'est pas effacée. */
  unregister: (stepId: string) => void;
};

export const AuthChatbotHostContext = createContext<ChatbotHost | null>(null);
