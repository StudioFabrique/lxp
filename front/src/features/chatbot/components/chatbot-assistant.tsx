import { useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AuthChatbotAvatar from "../../auth/components/AuthChatbotAvatar";
import AuthChatbotBubble from "../../auth/components/AuthChatbotBubble";
import AuthChatbotRadialMenu from "../../auth/components/AuthChatbotRadialMenu";
import { AuthChatbotDragContext } from "../../auth/components/AuthChatbotDragContext";
import { chooseChatbotGesture, type ChatbotGesture } from "../../auth/components/auth-chatbot-gestures";
import ChatbotAnswer from "./chatbot-parts/chatbot-answer";
import ChatbotPromptInput from "./chatbot-parts/chatbot-prompt-input";
import ChatbotQuizSuggestion from "./chatbot-parts/chatbot-quiz-suggestion";
import ChatbotRadialButton from "./chatbot-parts/chatbot-radial-button";
import ChatbotSelectionNotice from "./chatbot-parts/chatbot-selection-notice";
import ChatbotTutorialContent from "./chatbot-parts/chatbot-tutorial-content";
import ChatbotTutorialHighlight from "./chatbot-parts/chatbot-tutorial-highlight";
import useChatbot, { AI_UNAVAILABLE_MESSAGE, type ChatbotValues } from "../hooks/use-chatbot";
import useBubbleInViewport from "../hooks/use-bubble-in-viewport";
import useChatbotDock from "../hooks/use-chatbot-dock";
import useChatbotFirstFormation from "../hooks/use-chatbot-first-formation";
import useChatbotQuiz from "../hooks/use-chatbot-quiz";
import useChatbotTutorial from "../hooks/use-chatbot-tutorial";
import useChatbotUi from "../hooks/use-chatbot-ui";
import { buildChatbotQuestions, chatbotQuestionKey, pickSelectionPrompts, type ChatbotQuestion } from "../chatbot-questions";
import { chooseTutorialPlacement } from "../chatbot-position";
import { FIRST_FORMATION_TUTORIAL } from "../chatbot-tutorials";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import { useIntroPresentation } from "../../intro-presentation/useIntroPresentation";
import { canSuggestActivityQuiz } from "../../../components/tiptap-editor/utils/activity-read-time-helper";
import { prebuiltPrompt } from "../../../config/ai/ai-texts.json";
import { cn } from "../../../utils/cn";

type Props = {
  /** Faux quand les fonctionnalités IA sont désactivées : il ne reste que les tutoriels de l'interface. */
  aiEnabled: boolean;
  enableQuizSuggestion: boolean;
  /** Vrai quand la fenêtre de conversation ou un quiz occupe la place. */
  hidden: boolean;
  chatbot: ReturnType<typeof useChatbot>;
  chatbotUi: ReturnType<typeof useChatbotUi>;
  chatbotQuiz: ReturnType<typeof useChatbotQuiz>;
};

/**
 * Assistant virtuel de l'application : l'avatar de l'onboarding, déplaçable, dont un clic ouvre les questions
 * en éventail. Les réponses et les tutoriels apparaissent dans une bulle à son côté ; la fenêtre de
 * conversation complète n'est ouverte que sur demande (historique ou agrandissement d'une réponse).
 */
export default function ChatbotAssistant({ aiEnabled, enableQuizSuggestion, hidden, chatbot, chatbotUi, chatbotQuiz }: Props) {
  const { pathname } = useLocation();
  const routeRoot = pathname.split("/").filter(Boolean)[0] ?? "";
  const { currentActivity, activityTextSelection, setActivityTextSelection } = useContext(ChatbotContext);
  const { isOpen: isIntroOpen, hasJustRevealed } = useIntroPresentation();
  const reducedMotion = useReducedMotion();
  const dock = useChatbotDock(isIntroOpen);
  const { moveForTutorial, returnToRest } = dock;
  const tutorial = useChatbotTutorial();
  const [questionsOpen, setQuestionsOpen] = useState(false);
  // Passage déjà présenté : l'éventail s'ouvre seul pour une nouvelle sélection, pas pour une sélection laissée de côté.
  const [seenSelection, setSeenSelection] = useState("");
  const [answer, setAnswer] = useState<ChatbotValues | null>(null);
  const [gesture, setGesture] = useState<ChatbotGesture>(() => chooseChatbotGesture(null, Math.random()));
  const [replaySignal, setReplaySignal] = useState(0);
  const [bubbleObstructed, setBubbleObstructed] = useState(false);
  const [seed] = useState(Math.random);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const bubbleSlotRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const hasSelection = aiEnabled && activityTextSelection !== "";
  const selectionPending = hasSelection && activityTextSelection !== seenSelection;
  const tutorialActive = tutorial.active !== null;
  const radialOpen = !hidden && !tutorialActive && (questionsOpen || selectionPending);

  const questions = useMemo(() => buildChatbotQuestions({
    aiEnabled,
    aiUnavailable: chatbot.aiUnavailable,
    hasTextSelection: hasSelection,
    canSuggestQuiz: enableQuizSuggestion && aiEnabled && currentActivity !== undefined && canSuggestActivityQuiz(currentActivity.readTimeMs),
    tutorials: tutorial.tutorials,
    selectionPrompts: pickSelectionPrompts(prebuiltPrompt.suggestedContentBlocPrompts, seed, activityTextSelection),
  }), [aiEnabled, chatbot.aiUnavailable, hasSelection, enableQuizSuggestion, currentActivity, tutorial.tutorials, seed, activityTextSelection]);

  const closeRadial = useCallback(() => {
    setQuestionsOpen(false);
    setSeenSelection(activityTextSelection);
  }, [activityTextSelection]);

  // Tant que le bouton « Créer ma première formation » est affiché, l'assistant va seul vers lui, le met en
  // évidence et lui donne le focus : c'est là que démarre la création de contenu.
  const { startTutorial, stopTutorial: stopTutorialById } = tutorial;
  const firstFormation = useChatbotFirstFormation(isIntroOpen || hidden, useCallback((button: HTMLElement) => {
    setQuestionsOpen(false);
    setAnswer(null);
    startTutorial(FIRST_FORMATION_TUTORIAL);
    button.focus({ preventScroll: true });
  }, [startTutorial]), useCallback(() => stopTutorialById(FIRST_FORMATION_TUTORIAL.id), [stopTutorialById]));

  const animateAvatar = useCallback(() => {
    setGesture((current) => chooseChatbotGesture(current, Math.random()));
    setReplaySignal((current) => current + 1);
  }, []);

  const ask = async (text: string): Promise<void> => {
    if (chatbot.isLoading) return;
    closeRadial();
    setAnswer(null);
    animateAvatar();
    const { message } = await chatbot.sendPrompt(text);
    setAnswer(message);
    animateAvatar();
  };

  const select = (question: ChatbotQuestion): void => {
    if (question.kind === "prompt") {
      void ask(question.label);
      return;
    }
    closeRadial();
    if (question.kind === "tutorial") {
      setAnswer(null);
      tutorial.start(question.tutorialId);
    } else if (question.kind === "quiz") {
      chatbotQuiz.onTriggerQuiz();
    }
  };

  const openConversation = (size?: "small" | "large" | "full"): void => {
    closeRadial();
    void chatbotUi.handleOpenChatbot(size);
  };

  // Un tutoriel place l'assistant virtuel près de l'élément expliqué, puis il revient à sa place à la fin.
  const stepElement = tutorial.step?.element ?? null;
  useEffect(() => {
    if (!stepElement || hidden) return;
    const place = (): void => {
      const rect = stepElement.getBoundingClientRect();
      const placement = chooseTutorialPlacement(
        { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        { width: window.innerWidth, height: window.innerHeight },
      );
      if (placement) moveForTutorial(placement.point, placement.side);
      else returnToRest();
    };
    stepElement.scrollIntoView({ block: "center", inline: "nearest" });
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [stepElement, hidden, moveForTutorial, returnToRest]);

  useEffect(() => {
    if (!tutorialActive) return;
    return () => returnToRest();
  }, [tutorialActive, returnToRest]);

  const stopTutorial = tutorial.stop;
  useEffect(() => {
    if (!tutorialActive) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") stopTutorial();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tutorialActive, stopTutorial]);

  // L'éventail se ferme avec Échap ou d'un clic ailleurs, comme un menu.
  useEffect(() => {
    if (!radialOpen) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") closeRadial();
    };
    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target;
      if (target instanceof Node && (document.getElementById(menuId)?.contains(target) || avatarRef.current?.contains(target))) return;
      closeRadial();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [radialOpen, closeRadial, menuId]);

  const retry = chatbot.aiUnavailable && answer?.type === "error" && answer.message === AI_UNAVAILABLE_MESSAGE
    ? () => { chatbot.retryAi(); setAnswer(null); }
    : undefined;

  let bubbleContent: ReactNode = null;
  if (tutorial.active) {
    bubbleContent = (
      <ChatbotTutorialContent
        message={tutorial.step?.message ?? "Je n’ai rien à vous montrer ici pour le moment."}
        index={tutorial.step ? tutorial.active.index : undefined}
        total={tutorial.active.steps.length}
        onPrevious={tutorial.previous}
        onNext={tutorial.next}
        onStop={tutorial.stop}
        onNeverShowAgain={tutorial.active.tutorial.id === FIRST_FORMATION_TUTORIAL.id
          ? () => { firstFormation.hideForever(); tutorial.stop(); }
          : undefined}
      />
    );
  } else if (answer) {
    bubbleContent = <ChatbotAnswer message={answer} routeRoot={routeRoot} onRetry={retry} onExpand={() => openConversation("large")} onDismiss={() => setAnswer(null)} />;
  } else if (hasSelection) {
    bubbleContent = <ChatbotSelectionNotice textSelection={activityTextSelection} onDismiss={() => setActivityTextSelection("")} />;
  } else if (aiEnabled && chatbotQuiz.showQuizMessage) {
    bubbleContent = <ChatbotQuizSuggestion onTriggerQuiz={chatbotQuiz.onTriggerQuiz} onDismiss={chatbotQuiz.onDismissQuizMessage} />;
  }
  const waiting = chatbot.isLoading && !tutorialActive;
  const showBubble = !hidden && (waiting || bubbleContent !== null);
  useBubbleInViewport(bubbleSlotRef, showBubble);

  const items = questions.map((question) => ({
    key: chatbotQuestionKey(question),
    // La question libre reste à hauteur de l'assistant virtuel, du même côté que sa bulle de réponse.
    pinned: question.kind === "input",
    // Le bouton d'historique dépasse au-dessus du champ.
    overhang: question.kind === "input" ? 24 : 0,
    node: question.kind === "input"
      ? <ChatbotPromptInput onSubmitPrompt={(prompt) => void ask(prompt)} onOpenHistory={() => openConversation()} disabled={chatbot.aiUnavailable} autoFocus={!selectionPending && !chatbot.aiUnavailable} />
      : <ChatbotRadialButton label={question.label} onClick={() => select(question)} />,
  }));

  return (
    <AuthChatbotDragContext value={dock.dragContext}>
      <motion.div
        data-chatbot-dock
        className={cn("fixed left-0 top-0 z-45 size-16", hidden && "invisible")}
        style={{ x: dock.x, y: dock.y }}
        initial={reducedMotion || hasJustRevealed ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        drag
        dragControls={dock.dragControls}
        dragListener={false}
        dragConstraints={dock.dragBounds}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={dock.onDragStart}
        onDragEnd={dock.onDragEnd}
        aria-hidden={hidden || undefined}
      >
        <AuthChatbotAvatar
          buttonRef={avatarRef}
          gesture={gesture}
          compact
          replaySignal={replaySignal}
          introduction={false}
          expanded={radialOpen}
          menuId={menuId}
          onActivate={() => {
            setReplaySignal((current) => current + 1);
            if (tutorialActive || questions.length === 0) return;
            if (radialOpen) closeRadial();
            else setQuestionsOpen(true);
          }}
        />
        {showBubble && (
          <div ref={bubbleSlotRef} className={cn("absolute top-1/2 grid w-[300px] -translate-y-1/2", dock.side === "left" ? "right-full mr-3" : "left-full ml-3")}>
            <AuthChatbotBubble
              bubbleRef={bubbleRef}
              message={bubbleContent}
              waiting={waiting}
              hidden={radialOpen && bubbleObstructed}
              delay={0}
              side={dock.side}
            />
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {radialOpen && (
          <AuthChatbotRadialMenu id={menuId} label="Questions pour l’assistant virtuel" items={items} anchorRef={avatarRef} bubbleRef={bubbleRef} onOverlapChange={setBubbleObstructed} />
        )}
      </AnimatePresence>
      {tutorial.step && !hidden && <ChatbotTutorialHighlight element={tutorial.step.element} />}
    </AuthChatbotDragContext>
  );
}
