import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ChatbotContext } from "../../../store/chatbotContext";
import useActivityQuiz from "../../../hooks/use-activity-quiz";
import { chatbotWindowSize } from "./use-chatbot-ui";

// Temps pour lequel le chatbot restera actif jusqu'a se fermer seul
const CHATBOT_REMAINING_TIME = 10 * 60000; // 10 minutes

type TimerTriggerType = "modulePreview" | "chatbot" | "disabled";

export default function useChatbotQuiz(
  isChatbotOpened: boolean,
  onOpenChatbot: (overrideSize?: chatbotWindowSize) => void,
  onCloseChatbot: () => void,
) {
  const { currentActivity } = useContext(ChatbotContext);
  const quizState = useActivityQuiz(
    currentActivity?.courseId,
    currentActivity?.content,
  );

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showQuizMessage, setShowQuizMessage] = useState(false);
  const [hasMessageBeenShown, setHasMessageBeenShown] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // définir dans un useMemo
  const triggerType = useMemo((): TimerTriggerType => {
    if (currentActivity && !hasMessageBeenShown) {
      return isChatbotOpened
        ? // Dans le cas le chatbot est actif
          "chatbot"
        : // Quand le chatbot n'est pas ouvert
          "modulePreview";
    }

    // Quand aucun cours n'est prévisualisé
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
        // Définir le timer (selon la constante) si c'est dans le chatbot
        setTimeRemaining(CHATBOT_REMAINING_TIME);
        break;
      case "modulePreview":
        /**
         *  Définir le double du temps estimé lorsque le module est
         *  prévisualisé et que le chatbot est fermé
         */
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
        break;
      case "disabled":
        setShowQuizMessage(false);
        break;
    }
  }, [triggerType, onOpenChatbot, onCloseChatbot]);

  /**
   * Selon l'état du triggerType, attribuer une nouvelle valeur
   * de timer actuelle
   */
  useEffect(() => {
    onResetTimer();
  }, [onResetTimer]);

  /**
   * Déclenchement du timer lorsqu'il est terminé
   */
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
