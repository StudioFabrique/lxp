import { useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { chatbotMoveDurationMs, chatbotMoveEase } from "./auth-chatbot-motion";
import AuthChatbotPlacement from "./AuthChatbotPlacement";
import { AuthChatbotTransitionContext } from "./AuthChatbotTransitionContext";
import { chooseChatbotGesture } from "./auth-chatbot-gestures";
import AuthChatbotAvatar from "./AuthChatbotAvatar";
import AuthChatbotQuestions from "./AuthChatbotQuestions";
import AuthChatbotBubble from "./AuthChatbotBubble";
import type { ChatbotHelp } from "./AuthChatbotHostContext";

type Props = {
  message?: ReactNode;
  help?: ChatbotHelp;
  introduction?: boolean;
  delay?: number;
  compact?: boolean;
  typingMs?: number;
  scopeRef?: RefObject<HTMLDivElement | null>;
  stepId?: string;
};

const welcomeMessage = "Je serai là pour vous aider.";
const welcomeFollowUp = "Je serai là pour vous accompagner.";
// The typing dots show as soon as the bubble appears, until the welcome line replaces them.
const welcomeTypingMs = 2200;

export default function AuthChatbotDialogue({
  message,
  help,
  introduction = true,
  delay = 0,
  compact = false,
  typingMs,
  scopeRef,
  stepId,
}: Props) {
  const reducedMotion = useReducedMotion();
  // The default welcome starts with the typing dots, then a warm sentence replaces them.
  const followUp = introduction && message === undefined && !reducedMotion;
  const [replaySignal, setReplaySignal] = useState(0);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [answer, setAnswer] = useState<ReactNode>(null);
  // Every message shown in this step, kept invisibly in the bubble slot so its height, and the avatar centred on it, never changes.
  const [reserved, setReserved] = useState<ReactNode[]>(() => (followUp ? [welcomeFollowUp] : []));
  const [selected, setSelected] = useState<number | null>(0);
  const typingStep = !reducedMotion && typingMs !== undefined && typingMs > 0;
  const [waiting, setWaiting] = useState(followUp || (typingStep && !introduction));
  const [bubbleObstructed, setBubbleObstructed] = useState(false);
  const responseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => {
    if (responseTimer.current !== null) clearTimeout(responseTimer.current);
  }, []);
  const menuId = useId();
  const avatarRef = useRef<HTMLButtonElement>(null);
  const memory = useContext(AuthChatbotTransitionContext);
  // A dialogue taking over from a previous one moves from there rather than entering again.
  const [continued] = useState(() => !introduction && (memory?.getPosition() != null || memory?.getIntroAvatar() != null));
  const [gesture, setGesture] = useState(() => chooseChatbotGesture(memory?.getGesture() ?? null, Math.random()));
  useLayoutEffect(() => {
    if (stepId === undefined) return;
    if (responseTimer.current !== null) clearTimeout(responseTimer.current);
    const frame = requestAnimationFrame(() => {
    setWaiting(typingStep);
    setAnswer(null);
    setReserved([]);
    setSelected(0);
    setQuestionsOpen(false);
    setGesture(current => chooseChatbotGesture(current, Math.random()));
    setReplaySignal(current => current + 1);
    });
    return () => cancelAnimationFrame(frame);
  }, [stepId, typingStep]);
  // Les points restent affichés typingMs après l'apparition du chatbot, pas depuis le montage :
  // il est caché jusqu'à son placement.
  useEffect(() => {
    if (!typingStep || stepId === undefined) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = window.setInterval(() => {
      const host = bubbleRef.current?.closest<HTMLElement>('[data-chatbot-placement="page"]');
      if (!host || getComputedStyle(host).visibility !== "visible") return;
      window.clearInterval(poll);
      timer = setTimeout(() => setWaiting(false), typingMs);
    }, 100);
    return () => {
      window.clearInterval(poll);
      clearTimeout(timer);
    };
  }, [stepId, typingStep, typingMs]);
  useEffect(() => {
    if (!followUp) return;
    const timers = [
      setTimeout(() => {
        setAnswer(welcomeFollowUp);
        setWaiting(false);
        setGesture("wave");
        setReplaySignal(current => current + 1);
      }, welcomeTypingMs),
    ];
    return () => timers.forEach(clearTimeout);
  }, [followUp]);
  useEffect(() => {
    memory?.setGesture(gesture);
  }, [gesture, memory]);
  return (
    <AuthChatbotPlacement floating={!introduction} scopeRef={scopeRef} stepId={stepId}>
    <div>
    <motion.div
      data-chatbot-position="right"
      className="mx-auto mt-3 flex max-w-full items-center justify-end gap-3 text-sm"
      initial={reducedMotion || continued ? false : introduction ? { opacity: 0, x: "100vw" } : false}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : chatbotMoveDurationMs / 1000, delay: reducedMotion ? 0 : delay, ease: chatbotMoveEase }}
    >
      {/* Fixed slot: the bubble grows leftwards inside it, so the avatar never shifts. */}
      <div className="grid w-[300px] min-w-0">
        {[...(followUp ? [] : [message ?? welcomeMessage]), ...reserved].map((text, index) =>
          <div key={index} aria-hidden="true" className="invisible col-start-1 row-start-1 rounded-2xl border px-4 py-3 text-left leading-6">{text}</div>)}
        <AuthChatbotBubble bubbleRef={bubbleRef} message={answer ?? message ?? welcomeMessage} waiting={waiting}
          hidden={questionsOpen && bubbleObstructed} delay={replaySignal > 0 ? 0 : delay + (introduction ? .7 : .3)} />
      </div>
      <motion.div className="shrink-0"
        initial={reducedMotion || continued ? false : introduction ? { rotate: 720 } : false}
        animate={{ rotate: 0 }}
        transition={{ duration: reducedMotion ? 0 : chatbotMoveDurationMs / 1000, delay: reducedMotion ? 0 : delay, ease: chatbotMoveEase }}>
      <AuthChatbotAvatar buttonRef={avatarRef} gesture={gesture} compact={compact} replaySignal={replaySignal} introduction={introduction} expanded={questionsOpen} menuId={menuId}
        onActivate={() => {
          setReplaySignal(current => current + 1);
          if (!introduction) setQuestionsOpen(current => !current);
        }} />
      </motion.div>
    </motion.div>
    <AnimatePresence>
      {questionsOpen && <AuthChatbotQuestions id={menuId} help={help} message={message ?? welcomeMessage} anchorRef={avatarRef} bubbleRef={bubbleRef} onOverlapChange={setBubbleObstructed} selected={selected} onQuestionSelect={(index, nextAnswer) => {
        setSelected(index);
        setReserved(current => [...current, nextAnswer]);
        setQuestionsOpen(false);
        if (responseTimer.current !== null) clearTimeout(responseTimer.current);
        if (reducedMotion) {
          setWaiting(false);
          setAnswer(nextAnswer);
        } else {
          setWaiting(true);
          responseTimer.current = setTimeout(() => {
            setAnswer(nextAnswer);
            setWaiting(false);
            responseTimer.current = null;
          }, 750);
        }
        setGesture(current => chooseChatbotGesture(current, Math.random()));
        setReplaySignal(current => current + 1);
      }} />}
    </AnimatePresence>
    </div>
    </AuthChatbotPlacement>
  );
}
