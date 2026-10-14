import { createContext } from "react";
import type { ChatbotPoint, ChatbotRect } from "./auth-chatbot-placement";
import type { ChatbotGesture } from "./auth-chatbot-gestures";

/** introAvatar: last viewport rect of the introduction avatar, which the first step grows or shrinks from. */
export type ChatbotMemory = { position: ChatbotPoint | null; gesture: ChatbotGesture | null; introAvatar: ChatbotRect | null };
export type ChatbotMemoryAccess = {
  getPosition: () => ChatbotPoint | null;
  setPosition: (point: ChatbotPoint) => void;
  getGesture: () => ChatbotGesture | null;
  setGesture: (gesture: ChatbotGesture) => void;
  getIntroAvatar: () => ChatbotRect | null;
  setIntroAvatar: (rect: ChatbotRect | null) => void;
};

/** The last dialogue location survives changing onboarding steps. */
export const AuthChatbotTransitionContext = createContext<ChatbotMemoryAccess | null>(null);
