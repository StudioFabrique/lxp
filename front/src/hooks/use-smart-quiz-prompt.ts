import { useState, useRef, useEffect, useCallback } from "react";
import { Activity } from "../utils/interfaces/activity";

type UseSmartQuizPromptProps = {
  selectedActivity?: Activity;
  isLastActivitySelected: boolean;
  isLastLessonSelected: boolean;
  onTriggerRandomQuiz: () => void;
  onGoToNextActivity: () => void;
};

export default function useSmartQuizPrompt({
  selectedActivity,
  isLastActivitySelected,
  isLastLessonSelected,
  onTriggerRandomQuiz,
  onGoToNextActivity,
}: UseSmartQuizPromptProps) {
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  const [activityStartTime, setActivityStartTime] = useState(Date.now());
  const hasBypassedQuizRef = useRef(false);

  // Réinitialiser le timer à chaque changement d'activité
  useEffect(() => {
    if (selectedActivity?.id) {
      setActivityStartTime(Date.now());
      hasBypassedQuizRef.current = false;
    }
  }, [selectedActivity?.id]);

  const handleNextActivity = useCallback(() => {
    if (hasBypassedQuizRef.current) {
      onGoToNextActivity();
      return;
    }

    const timeSpent = Date.now() - activityStartTime;
    const isTooFast = timeSpent < 10 * 1000;
    const isTooSlow = timeSpent > 5 * 60 * 1000;

    if (
      selectedActivity?.type === "text" &&
      (!isLastActivitySelected || !isLastLessonSelected) &&
      (isTooFast || isTooSlow)
    ) {
      setShowQuizPrompt(true);
    } else {
      onGoToNextActivity();
    }
  }, [
    activityStartTime,
    selectedActivity,
    isLastActivitySelected,
    isLastLessonSelected,
    onGoToNextActivity,
  ]);

  const handleDeclineQuiz = () => {
    setShowQuizPrompt(false);
    hasBypassedQuizRef.current = true;
    onGoToNextActivity();
  };

  const handleAcceptQuiz = () => {
    setShowQuizPrompt(false);
    hasBypassedQuizRef.current = true;
    onTriggerRandomQuiz();
  };

  return {
    showQuizPrompt,
    handleNextActivity,
    handleAcceptQuiz,
    handleDeclineQuiz,
  };
}
