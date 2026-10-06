import { createContext, type ReactNode, type RefObject } from "react";

export type ChatbotStep = {
  message?: ReactNode;
  compact?: boolean;
  delay?: number;
  scopeRef: RefObject<HTMLDivElement | null>;
  stepId: string;
};

export const AuthChatbotHostContext = createContext<((step: ChatbotStep) => void) | null>(null);
