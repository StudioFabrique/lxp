import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Can from "../../UI/can/can.component";
import FeedbacksButton from "../../UI/feedbacks/feedbacks-button";

type Props = {
  modalVisibility: "deletionModal" | "lessonCompletionModal" | "none";
  isFirstActivity: boolean;
  isLastActivity: boolean;
  isLessonCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCompleteLesson: () => void;
};

const ActivityBottomNavigation = ({
  modalVisibility,
  isFirstActivity,
  isLastActivity,
  isLessonCompleted,
  onPrevious,
  onNext,
  onCompleteLesson,
}: Props) => (
  <div className="flex gap-2">
    {!isFirstActivity && (
      <button onClick={onPrevious} className="btn btn-primary text-base-100">
        <ArrowLeft />
        Activité précédente
      </button>
    )}
    {isLastActivity ? (
      // Bouton pour terminer la leçon afin d'afficher une modal
      <Can action="component" object="progression">
        <FeedbacksButton
          className="btn btn-primary text-nowrap text-base-100"
          feedbackType="thumbUp"
          showFeedback={!isLessonCompleted}
          disabled={modalVisibility !== "none"}
          onClick={onCompleteLesson}
        >
          {isLessonCompleted ? (
            <>
              Leçon Suivante
              <ArrowRight />
            </>
          ) : (
            <>
              <Check />
              Marquer comme terminé
            </>
          )}
        </FeedbacksButton>
      </Can>
    ) : (
      <button onClick={onNext} className="btn btn-primary text-base-100">
        Activité suivante
        <ArrowRight />
      </button>
    )}
  </div>
);

export default ActivityBottomNavigation;
