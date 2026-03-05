import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { Activity } from "../utils/interfaces/activity";
import hasPermission from "../utils/hasPermission";
import { Context } from "../store/context.store";

type UseSmartQuizPromptProps = {
  selectedActivity?: Activity;
  isLessonCompleted: boolean;
  isLastActivitySelected: boolean;
  isLastLessonSelected: boolean;
  onTriggerRandomQuiz: () => void;
  onGoToNextActivity: () => void;
};

export default function useSmartQuizPrompt({
  selectedActivity,
  isLessonCompleted,
  isLastActivitySelected,
  isLastLessonSelected,
  onTriggerRandomQuiz,
  onGoToNextActivity,
}: UseSmartQuizPromptProps) {
  const { user } = useContext(Context);

  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  const activityStartTime = useRef(Date.now());
  const hasBypassedQuizRef = useRef(false);

  const handleNextActivity = useCallback(() => {
    const userIsAdmin =
      user?.permissions && hasPermission(user.permissions, "update", "lesson");

    if (hasBypassedQuizRef.current || userIsAdmin || isLessonCompleted) {
      onGoToNextActivity();
      return;
    }

    const timeSpent = Date.now() - activityStartTime.current;
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
    selectedActivity,
    isLastActivitySelected,
    isLessonCompleted,
    isLastLessonSelected,
    onGoToNextActivity,
    user?.permissions,
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

  // Réinitialiser le timer à chaque changement d'activité
  useEffect(() => {
    if (selectedActivity?.id) {
      activityStartTime.current = Date.now();
      hasBypassedQuizRef.current = false;
    }
  }, [selectedActivity?.id]);

  return {
    showQuizPrompt,
    handleNextActivity,
    handleAcceptQuiz,
    handleDeclineQuiz,
  };
}
