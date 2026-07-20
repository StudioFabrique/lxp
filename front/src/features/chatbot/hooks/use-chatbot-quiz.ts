import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { chatbotWindowSize } from "./use-chatbot-ui";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import useCourseQuiz from "../../quiz/hooks/use-course-quiz";

const CHATBOT_REMAINING_TIME = 10 * 60000;

type TimerTriggerType = "modulePreview" | "chatbot" | "disabled";

export default function useChatbotQuiz(
  isChatbotOpened: boolean,
  onOpenChatbot: (overrideSize?: chatbotWindowSize) => void,
  onCloseChatbot: () => void,
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
    if (
      currentActivity?.readTimeMs &&
      currentActivity?.readTimeMs * 2 < 2 * 60 * 1000
    )
      return "disabled";

    if (currentActivity && !hasMessageBeenShown) {
      return isChatbotOpened ? "chatbot" : "modulePreview";
    }

    return "disabled";
  }, [currentActivity, isChatbotOpened, hasMessageBeenShown]);

  const onTriggerQuiz = () => {
    quizState.onTriggerRandomQuiz();
    onCloseChatbot();
    setShowQuizMessage(false);
  };

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
        onOpenChatbot("small");
        setShowQuizMessage(true);
        setHasMessageBeenShown(true);
        setActivityTextSelection("");
        break;
      case "disabled":
        setShowQuizMessage(false);
        break;
    }
  }, [triggerType, onOpenChatbot, onCloseChatbot, setActivityTextSelection]);

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
    showQuizMessage,
    isQuizModalOpened: quizState.isOpen,
    onResetTimer,
    quizState,
  };
}
