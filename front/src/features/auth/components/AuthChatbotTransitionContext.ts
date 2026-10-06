import { createContext } from "react";
import type { ChatbotPoint } from "./auth-chatbot-placement";
import type { ChatbotGesture } from "./auth-chatbot-gestures";

export type ChatbotMemory = { position: ChatbotPoint | null; gesture: ChatbotGesture | null };
export type ChatbotMemoryAccess = {
  getPosition: () => ChatbotPoint | null;
  setPosition: (point: ChatbotPoint) => void;
  getGesture: () => ChatbotGesture | null;
  setGesture: (gesture: ChatbotGesture) => void;
};

/** The last dialogue location survives changing onboarding steps. */
export const AuthChatbotTransitionContext = createContext<ChatbotMemoryAccess | null>(null);
