import { createContext, type PointerEvent } from "react";

export const AuthChatbotDragContext = createContext<{
  start: (event: PointerEvent<HTMLButtonElement>) => void;
  wasDragged: () => boolean;
  /** True while the pointer holds the virtual assistant, so the avatar can react to being carried. */
  dragging: boolean;
} | null>(null);
