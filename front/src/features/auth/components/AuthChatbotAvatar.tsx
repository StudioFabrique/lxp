import { useContext, type Ref } from "react";
import AuthAnimatedLogo from "./AuthAnimatedLogo";
import { AuthChatbotDragContext } from "./AuthChatbotDragContext";
import type { ChatbotGesture } from "./auth-chatbot-gestures";
import { cn } from "../../../utils/cn";

type Props = {
  gesture: ChatbotGesture;
  compact: boolean;
  replaySignal: number;
  introduction: boolean;
  expanded: boolean;
  menuId: string;
  onActivate: () => void;
  buttonRef: Ref<HTMLButtonElement>;
};

export default function AuthChatbotAvatar({ gesture, compact, replaySignal, introduction, expanded, menuId, onActivate, buttonRef }: Props) {
  const drag = useContext(AuthChatbotDragContext);
  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn("shrink-0 border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary", introduction ? "cursor-pointer" : "cursor-grab touch-none active:cursor-grabbing")}
      aria-label={introduction ? "Rejouer le salut du chatbot ANDRIA" : "Afficher les questions d’aide du chatbot ANDRIA"}
      aria-expanded={introduction ? undefined : expanded}
      aria-controls={expanded ? menuId : undefined}
      onPointerDown={event => { if (!introduction) drag?.start(event); }}
      onClick={() => { if (!drag?.wasDragged()) onActivate(); }}
    >
      <AuthAnimatedLogo mode="chatbot" gesture={gesture} className={cn("rounded-full", compact ? "w-16" : "w-20 sm:w-28")} replaySignal={replaySignal} />
    </button>
  );
}
