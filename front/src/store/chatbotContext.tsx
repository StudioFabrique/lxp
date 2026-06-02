import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";

// Mots par minute de base pour le calcul du temps de lecture
const WPM_BASE = 200;

type CourseDifficulty = "easy" | "medium" | "hard";
type TimerTriggerType = "modulePreview" | "chatbot" | "disabled";

type ChatbotContextType = {
  currentCourseId: number | undefined;
  estimatedActivityReadTimeInMinutes: number;
  showQuizMessage: boolean;
  hasChatbotClosed: boolean;
  hasTrigerredQuiz: boolean;
  setCurrentCourseId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setWordsCount: React.Dispatch<React.SetStateAction<number>>;
  onChangeActivityDifficulty: (difficulty: CourseDifficulty) => void;
  onTriggerQuiz: () => void;
  onTriggerTimer: (triggerType: TimerTriggerType) => void;
};

const ChatbotContext = React.createContext<ChatbotContextType>(
  {} as ChatbotContextType,
);

const ChatbotProvider = ({ children }: React.PropsWithChildren) => {
  // Récupérer le chemin actuel de l'URL dans le hook react router
  const { pathname } = useLocation();

  const [currentCourseId, setCurrentCourseId] = useState<number | undefined>();

  // states relatifs à la gestion des comportements du chatbot selon le temps écoulé
  const [wordsCount, setWordsCount] = useState(0);
  const [triggerType, setTriggerType] = useState<TimerTriggerType>("disabled");
  const [courseDifficultyFactor, setCourseDifficultyFactor] =
    useState<number>(0.75);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showQuizMessage, setShowQuizMessage] = useState(false);
  const [hasTrigerredQuiz, setHasTrigerredQuiz] = useState(false);
  const [hasChatbotClosed, setHasChatbotClosed] = useState(false);

  const estimatedActivityReadTime =
    ((wordsCount * courseDifficultyFactor) / WPM_BASE) * 60000;

  const onChangeActivityDifficulty = (difficulty: CourseDifficulty) => {
    switch (difficulty) {
      case "easy":
        setCourseDifficultyFactor(1);
        break;
      case "medium":
        setCourseDifficultyFactor(0.75);
        break;
      case "hard":
        setCourseDifficultyFactor(0.5);
        break;
    }
  };

  /**
   * Appel de cette fonction quand le timer doit être déclenché
   * selon l'action (fermeture du chatbot, fin du module, reset du timer etc.)
   */
  const onTriggerTimer = useCallback(
    (triggerType: TimerTriggerType) => {
      console.log({ estimatedActivityReadTime, triggerType, timeRemaining });
      switch (triggerType) {
        case "disabled":
          setTimeRemaining(0);
          break;
        case "modulePreview":
          setTimeRemaining(estimatedActivityReadTime * 2); // double le temps estimé lorsque le module est prévisualisé et que le chatbot est fermé
          break;
        case "chatbot":
          setTimeRemaining(10 * 60000); // 10 minutes si c'est dans le chatbot
          break;
        default:
          break;
      }

      setTriggerType(triggerType);
    },
    [estimatedActivityReadTime, timeRemaining],
  );

  const onTimerEnd = useCallback(() => {
    switch (triggerType) {
      case "modulePreview":
        console.log({ estimatedActivityReadTime, triggerType, timeRemaining });
        setShowQuizMessage(true);
        break;
      case "chatbot":
        console.log({ estimatedActivityReadTime, triggerType, timeRemaining });
        setHasChatbotClosed(true);
        onTriggerTimer("modulePreview");
        break;
      case "disabled":
        console.log({ estimatedActivityReadTime, triggerType, timeRemaining });
        setTimeRemaining(0);
        break;
      default:
        break;
    }
  }, [triggerType, onTriggerTimer, estimatedActivityReadTime, timeRemaining]);

  const onTriggerQuiz = useCallback(async () => {
    setHasTrigerredQuiz(true);
  }, []);

  useEffect(() => {
    if (!pathname.includes("/parcours/module/")) {
      setCurrentCourseId(undefined);
    }
  }, [pathname]);

  /**
   * Activation du timer
   */
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        onTimerEnd();
      }, timeRemaining);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, onTimerEnd]);

  return (
    <ChatbotContext.Provider
      value={{
        currentCourseId,
        estimatedActivityReadTimeInMinutes: Math.round(
          estimatedActivityReadTime / 60000,
        ),
        showQuizMessage,
        hasChatbotClosed,
        hasTrigerredQuiz,
        setCurrentCourseId,
        setWordsCount,
        onChangeActivityDifficulty,
        onTriggerQuiz,
        onTriggerTimer,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export { ChatbotContext, ChatbotProvider };
