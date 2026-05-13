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
import toast from "react-hot-toast";

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

  const activityStartTime = useRef(Date.now());
  const hasBypassedQuizRef = useRef(false);
  const toastIdRef = useRef<string | null>(null);

  // Déterminer si l'utilisateur peut passer outre les règles de temps
  const canSkipLogic = useMemo(() => {
    const userIsAdmin =
      user?.permissions && hasPermission(user.permissions, "update", "lesson");
    return userIsAdmin || isLessonCompleted || hasBypassedQuizRef.current;
  }, [user, isLessonCompleted]);

  const handleDeclineQuiz = useCallback(() => {
    setShowQuizPrompt(false);
    hasBypassedQuizRef.current = true;
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    onGoToNextActivity();
  }, [onGoToNextActivity]);

  const handleAcceptQuiz = useCallback(() => {
    setShowQuizPrompt(false);
    hasBypassedQuizRef.current = true;
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
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

  // Réinitialisation lors du changement d'activité
  useEffect(() => {
    if (!selectedActivity?.id || isAnyQuizOpen) return;

    activityStartTime.current = Date.now();
    hasBypassedQuizRef.current = false;
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);

    // Timer pour déclencher le toast après 5 minutes
    const timer = setTimeout(() => {
      // On ne déclenche pas le toast si l'utilisateur est admin ou a déjà fini
      if (canSkipLogic || selectedActivity?.type !== "text") return;

      toastIdRef.current = toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              Il semble que tu passes beaucoup de temps sur l'activité ! Générer
              un quiz aléatoire pour tester tes acquis ?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="btn btn-sm btn-primary"
                onClick={handleAcceptQuiz}
              >
                Oui
              </button>
              <button
                className="btn btn-sm"
                onClick={() => toast.dismiss(t.id)}
              >
                Non
              </button>
            </div>
          </div>
        ),
        { duration: Infinity },
      );
    }, MAX_TIME_MS);

    return () => {
      clearTimeout(timer);
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    };
  }, [
    selectedActivity?.id,
    canSkipLogic,
    handleAcceptQuiz,
    selectedActivity?.type,
    isAnyQuizOpen,
  ]);

  return {
    showQuizPrompt,
    handleNextActivity,
    handleAcceptQuiz,
    handleDeclineQuiz,
  };
}
