import { createContext, type PointerEvent } from "react";

export const AuthChatbotDragContext = createContext<{
  start: (event: PointerEvent<HTMLButtonElement>) => void;
  wasDragged: () => boolean;
} | null>(null);
