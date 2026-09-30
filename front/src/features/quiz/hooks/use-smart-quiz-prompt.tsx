import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { Activity } from "../../../utils/interfaces/activity";
import { AbilityContext } from "../../../rbac/AbilityProvider";
import { canSuggestActivityQuiz } from "../../../components/tiptap-editor/utils/activity-read-time-helper";

const MIN_READ_TIME_RATIO = 0.5;
const MAX_READ_TIME_RATIO = 2;

type UseSmartQuizPromptProps = {
  selectedActivity?: Activity;
  estimatedReadTimeMs?: number;
  isLessonCompleted: boolean;
  isAnyQuizOpen: boolean;
  onTriggerRandomQuiz: () => void;
  onGoToNextActivity: () => void;
  onCompleteLesson: () => void;
  aiIndexed?: boolean;
};

export default function useSmartQuizPrompt({
  selectedActivity,
  estimatedReadTimeMs,
  isLessonCompleted,
  isAnyQuizOpen,
  onTriggerRandomQuiz,
  onGoToNextActivity,
  onCompleteLesson,
  aiIndexed = true,
}: UseSmartQuizPromptProps) {
  const ability = useContext(AbilityContext);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  const [bypassedActivityId, setBypassedActivityId] = useState<number>();
  const pendingContinuation = useRef<(() => void) | undefined>(undefined);
  const activityStartTime = useRef(0);
  const currentActivityIdRef = useRef<number | undefined>(undefined);
  const prevIsAnyQuizOpenRef = useRef(isAnyQuizOpen);

  const handleDeclineQuiz = useCallback(() => {
    setShowQuizPrompt(false);
    setBypassedActivityId(selectedActivity?.id);
    const continueAction = pendingContinuation.current;
    pendingContinuation.current = undefined;
    continueAction?.();
  }, [selectedActivity?.id]);

  const handleAcceptQuiz = useCallback(() => {
    setShowQuizPrompt(false);
    setBypassedActivityId(selectedActivity?.id);
    pendingContinuation.current = undefined;
    onTriggerRandomQuiz();
  }, [selectedActivity?.id, onTriggerRandomQuiz]);

  const handleContinue = useCallback((onContinue: () => void) => {
    if (isAnyQuizOpen) return;

    const canSkipLogic =
      ability.can("update", "lesson") ||
      isLessonCompleted ||
      (selectedActivity?.id !== undefined && bypassedActivityId === selectedActivity.id);

    if (!aiIndexed || canSkipLogic || !canSuggestActivityQuiz(estimatedReadTimeMs)) {
      onContinue();
      return;
    }

    const timeSpent = Date.now() - activityStartTime.current;
    const isTooFast = timeSpent < estimatedReadTimeMs * MIN_READ_TIME_RATIO;
    const isTooSlow = timeSpent > estimatedReadTimeMs * MAX_READ_TIME_RATIO;

    if (selectedActivity?.type === "text" && (isTooFast || isTooSlow)) {
      pendingContinuation.current = onContinue;
      setShowQuizPrompt(true);
    } else {
      onContinue();
    }
  }, [ability, isLessonCompleted, bypassedActivityId, aiIndexed, selectedActivity, isAnyQuizOpen, estimatedReadTimeMs]);

  const handleNextActivity = useCallback(
    () => handleContinue(onGoToNextActivity),
    [handleContinue, onGoToNextActivity],
  );

  const handleCompleteLesson = useCallback(
    () => handleContinue(onCompleteLesson),
    [handleContinue, onCompleteLesson],
  );

  useEffect(() => {
    const activityChanged = currentActivityIdRef.current !== selectedActivity?.id;
    const quizJustClosed = prevIsAnyQuizOpenRef.current && !isAnyQuizOpen;
    prevIsAnyQuizOpenRef.current = isAnyQuizOpen;

    // Une fermeture de quiz ne doit pas dispenser la nouvelle activité.
    if (activityChanged) {
      currentActivityIdRef.current = selectedActivity?.id;
      activityStartTime.current = Date.now();
      setBypassedActivityId(undefined);
      setShowQuizPrompt(false);
      pendingContinuation.current = undefined;
    } else if (quizJustClosed) {
      setBypassedActivityId(selectedActivity?.id);
    }
  }, [selectedActivity?.id, isAnyQuizOpen]);

  return {
    showQuizPrompt,
    handleNextActivity,
    handleCompleteLesson,
    handleAcceptQuiz,
    handleDeclineQuiz,
  };
}
