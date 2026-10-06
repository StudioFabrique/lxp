import { useContext, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AuthChatbotPlacement from "./AuthChatbotPlacement";
import { AuthChatbotTransitionContext } from "./AuthChatbotTransitionContext";
import { chooseChatbotGesture } from "./auth-chatbot-gestures";
import AuthChatbotAvatar from "./AuthChatbotAvatar";
import AuthChatbotQuestions from "./AuthChatbotQuestions";
import AuthChatbotBubble from "./AuthChatbotBubble";

type Props = {
  message?: ReactNode;
  introduction?: boolean;
  delay?: number;
  compact?: boolean;
  scopeRef?: RefObject<HTMLDivElement | null>;
  stepId?: string;
};

export default function AuthChatbotDialogue({
  message = "Je serai là pour vous aider.",
  introduction = true,
  delay = 0,
  compact = false,
  scopeRef,
  stepId,
}: Props) {
  const reducedMotion = useReducedMotion();
  const [replaySignal, setReplaySignal] = useState(0);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [answer, setAnswer] = useState<ReactNode>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [waiting, setWaiting] = useState(false);
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
    setWaiting(false);
    setAnswer(null);
    setSelected(null);
    setQuestionsOpen(false);
    setGesture(current => chooseChatbotGesture(current, Math.random()));
    setReplaySignal(current => current + 1);
    });
    return () => cancelAnimationFrame(frame);
  }, [stepId]);
  useEffect(() => {
    memory?.setGesture(gesture);
  }, [gesture, memory]);
  return (
    <AuthChatbotPlacement floating={!introduction} scopeRef={scopeRef} stepId={stepId}>
    <div>
    <motion.div
      data-chatbot-position="right"
      className="mx-auto mt-3 flex max-w-full items-center justify-end gap-3 text-sm"
      initial={reducedMotion || continued ? false : { opacity: 0, x: introduction ? "100vw" : 24 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <AuthChatbotBubble bubbleRef={bubbleRef} message={answer ?? message} waiting={waiting}
        hidden={questionsOpen && bubbleObstructed} delay={replaySignal > 0 ? 0 : delay + (introduction ? .7 : .3)} />
      <AuthChatbotAvatar buttonRef={avatarRef} gesture={gesture} compact={compact} replaySignal={replaySignal} introduction={introduction} expanded={questionsOpen} menuId={menuId}
        onActivate={() => {
          setReplaySignal(current => current + 1);
          if (!introduction) setQuestionsOpen(current => !current);
        }} />
    </motion.div>
    <AnimatePresence>
      {questionsOpen && <AuthChatbotQuestions id={menuId} message={message} anchorRef={avatarRef} bubbleRef={bubbleRef} onOverlapChange={setBubbleObstructed} selected={selected} onQuestionSelect={(index, nextAnswer) => {
        setSelected(index);
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
