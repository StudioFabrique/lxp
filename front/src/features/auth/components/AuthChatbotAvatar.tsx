import { useContext, type Ref } from "react";
import { motion, useReducedMotion } from "motion/react";
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
  const reducedMotion = useReducedMotion();
  const carried = drag?.dragging === true && !reducedMotion;
  return (
    <button
      ref={buttonRef}
      data-chatbot-avatar
      type="button"
      className={cn("shrink-0 border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary", introduction ? "cursor-pointer" : "cursor-grab touch-none active:cursor-grabbing")}
      aria-label={introduction ? "Rejouer le salut du chatbot ANDRIA" : "Afficher les questions d’aide du chatbot ANDRIA"}
      aria-expanded={introduction ? undefined : expanded}
      aria-controls={expanded ? menuId : undefined}
      onPointerDown={event => { if (!introduction) drag?.start(event); }}
      onClick={() => { if (!drag?.wasDragged()) onActivate(); }}
    >
      {/* While carried, the avatar sways like a held toy, then settles when released. */}
      <motion.span className="block"
        animate={carried ? { rotate: [-9, 9, -9], scale: 1.1, y: -4 } : { rotate: 0, scale: 1, y: 0 }}
        transition={carried ? { rotate: { duration: 0.7, repeat: Infinity, ease: "easeInOut" }, default: { type: "spring", stiffness: 300, damping: 14 } } : { type: "spring", stiffness: 260, damping: 12 }}>
        <AuthAnimatedLogo mode="chatbot" gesture={gesture} className={cn("rounded-full", compact ? "w-16" : "w-20 sm:w-28")} replaySignal={replaySignal} />
      </motion.span>
    </button>
  );
}
