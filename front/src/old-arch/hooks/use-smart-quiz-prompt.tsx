import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { Activity } from "../utils/interfaces/activity";
import hasPermission from "../utils/hasPermission";
import { Context } from "../store/context.store";

const MIN_TIME_MS = 10 * 1000; // 10 secondes
const MAX_TIME_MS = 5 * 60 * 1000; // 5 minutes

type UseSmartQuizPromptProps = {
  selectedActivity?: Activity;
  isLessonCompleted: boolean;
  isLastActivitySelected: boolean;
  isLastLessonSelected: boolean;
  isAnyQuizOpen: boolean;
  onTriggerRandomQuiz: () => void;
  onGoToNextActivity: () => void;
};

export default function useSmartQuizPrompt({
  selectedActivity,
  isLessonCompleted,
  isLastActivitySelected,
  isLastLessonSelected,
  isAnyQuizOpen,
  onTriggerRandomQuiz,
  onGoToNextActivity,
}: UseSmartQuizPromptProps) {
  const { user } = useContext(Context);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  const [hasBypassedQuiz, setHasBypassedQuiz] = useState(false);

  const activityStartTime = useRef(Date.now());

  // Utilisation d'une ref pour suivre l'ID de l'activité indépendamment des re-renders
  const currentActivityIdRef = useRef<string | number | undefined>(
    selectedActivity?.id,
  );
  const prevIsAnyQuizOpenRef = useRef(isAnyQuizOpen);

  // Déterminer si l'utilisateur peut passer outre les règles de temps
  const canSkipLogic = useMemo(() => {
    const userIsAdmin =
      user?.permissions && hasPermission(user.permissions, "update", "lesson");
    return userIsAdmin || isLessonCompleted || hasBypassedQuiz;
  }, [user, isLessonCompleted, hasBypassedQuiz]);

  const handleDeclineQuiz = useCallback(() => {
    setShowQuizPrompt(false);
    setHasBypassedQuiz(true);
    onGoToNextActivity();
  }, [onGoToNextActivity]);

  const handleAcceptQuiz = useCallback(() => {
    setShowQuizPrompt(false);
    setHasBypassedQuiz(true);
    onTriggerRandomQuiz();
  }, [onTriggerRandomQuiz]);

  const handleNextActivity = useCallback(() => {
    if (canSkipLogic) {
      onGoToNextActivity();
      return;
    }

    const timeSpent = Date.now() - activityStartTime.current;
    const isTooFast = timeSpent < MIN_TIME_MS;
    const isTooSlow = timeSpent > MAX_TIME_MS;

    const isTextActivity = selectedActivity?.type === "text";
    const isNotAtTheEnd = !isLastActivitySelected || !isLastLessonSelected;

    if (isTextActivity && isNotAtTheEnd && (isTooFast || isTooSlow)) {
      setShowQuizPrompt(true);
    } else {
      onGoToNextActivity();
    }
  }, [
    canSkipLogic,
    selectedActivity,
    isLastActivitySelected,
    isLastLessonSelected,
    onGoToNextActivity,
  ]);

  useEffect(() => {
    const quizJustClosed = prevIsAnyQuizOpenRef.current && !isAnyQuizOpen;
    prevIsAnyQuizOpenRef.current = isAnyQuizOpen;

    if (quizJustClosed) {
      setHasBypassedQuiz(true);
      return;
    }

    if (!selectedActivity?.id || isAnyQuizOpen) return;

    if (currentActivityIdRef.current !== selectedActivity.id) {
      currentActivityIdRef.current = selectedActivity.id;
      activityStartTime.current = Date.now();
      setHasBypassedQuiz(false);
    }
  }, [
    selectedActivity?.id,
    isAnyQuizOpen,
    canSkipLogic,
    handleAcceptQuiz,
    selectedActivity?.type,
  ]);

  return {
    showQuizPrompt,
    handleNextActivity,
    handleAcceptQuiz,
    handleDeclineQuiz,
  };
}
