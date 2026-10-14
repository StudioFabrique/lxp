import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import useCourseQuiz from "../../quiz/hooks/use-course-quiz";
import { canSuggestActivityQuiz } from "../../../components/tiptap-editor/utils/activity-read-time-helper";

const CHATBOT_REMAINING_TIME = 10 * 60000;

type TimerTriggerType = "modulePreview" | "chatbot" | "disabled";

export default function useChatbotQuiz(
  isChatbotOpened: boolean,
  onCloseChatbot: () => void,
  isQuizSuggestionEnabled: boolean,
) {
  const { currentActivity, setActivityTextSelection } =
    useContext(ChatbotContext);
  const quizState = useCourseQuiz(
    currentActivity?.courseId,
    currentActivity?.content,
  );

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showQuizMessage, setShowQuizMessage] = useState(false);
  const [hasMessageBeenShown, setHasMessageBeenShown] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  const triggerType = useMemo((): TimerTriggerType => {
    if (!isQuizSuggestionEnabled) return "disabled";

    if (!canSuggestActivityQuiz(currentActivity?.readTimeMs))
      return "disabled";

    if (currentActivity && !hasMessageBeenShown) {
      return isChatbotOpened ? "chatbot" : "modulePreview";
    }

    return "disabled";
  }, [
    currentActivity,
    isChatbotOpened,
    hasMessageBeenShown,
    isQuizSuggestionEnabled,
  ]);

  const onTriggerQuiz = () => {
    quizState.onTriggerRandomQuiz();
    onCloseChatbot();
    setShowQuizMessage(false);
  };

  const onDismissQuizMessage = useCallback(() => setShowQuizMessage(false), []);

  const onResetTimer = useCallback(() => {
    switch (triggerType) {
      case "chatbot":
        setTimeRemaining(CHATBOT_REMAINING_TIME);
        break;
      case "modulePreview":
        if (currentActivity?.readTimeMs)
          setTimeRemaining(currentActivity?.readTimeMs * 2);
        break;
      case "disabled":
        setTimeRemaining(0);
        break;
    }
    setTimerKey((prevKey) => prevKey + 1);
  }, [currentActivity?.readTimeMs, triggerType]);

  const onTimerEnd = useCallback(() => {
    switch (triggerType) {
      case "chatbot":
        onCloseChatbot();
        break;
      case "modulePreview":
        // L'assistant virtuel affiche la proposition dans sa bulle, sans ouvrir la fenêtre de conversation.
        setShowQuizMessage(true);
        setHasMessageBeenShown(true);
        setActivityTextSelection("");
        break;
      case "disabled":
        setShowQuizMessage(false);
        break;
    }
  }, [triggerType, onCloseChatbot, setActivityTextSelection]);

  useEffect(() => {
    onResetTimer();
  }, [onResetTimer]);

  useEffect(() => {
    if (timeRemaining > 0 && triggerType !== "disabled") {
      const timer = setTimeout(() => {
        onTimerEnd();
      }, timeRemaining);

      return () => clearTimeout(timer);
    }
  }, [timeRemaining, onTimerEnd, triggerType, timerKey]);

  useEffect(() => {
    if (currentActivity?.courseId && currentActivity?.content) {
      setShowQuizMessage(false);
      setHasMessageBeenShown(false);
    }
  }, [currentActivity?.courseId, currentActivity?.content]);

  return {
    onTriggerQuiz,
    onDismissQuizMessage,
    showQuizMessage: isQuizSuggestionEnabled && showQuizMessage,
    isQuizModalOpened: quizState.isOpen,
    onResetTimer,
    quizState,
  };
}
