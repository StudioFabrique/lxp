import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "../../../utils";
import Can from "../../UI/can/can.component";
import FeedbacksButton from "../../UI/feedbacks/feedbacks-button";
import { PropsWithChildren } from "react";

type Props = {
  modalVisibility: "deletionModal" | "lessonCompletionModal" | "none";
  isFirstActivitySelected: boolean;
  isLastActivitySelected: boolean;
  isLastLessonSelected: boolean;
  isLessonCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCompleteLesson: () => void;
};

const ActivityBottomNavigation = ({
  modalVisibility,
  isFirstActivitySelected,
  isLastActivitySelected,
  isLastLessonSelected,
  isLessonCompleted,
  onPrevious,
  onNext,
  onCompleteLesson,
  children,
}: PropsWithChildren<Props>) => (
  <div
    className={cn(
      "flex gap-2 w-full",
      !isLastActivitySelected && isFirstActivitySelected
        ? "justify-end"
        : "justify-between",
    )}
  >
    {!isFirstActivitySelected && (
      <button onClick={onPrevious} className="btn btn-primary text-base-100">
        <ArrowLeft />
        Activité précédente
      </button>
    )}
    {isLastActivitySelected ? (
      (!isLastLessonSelected || !isLessonCompleted) && (
        <Can action="component" object="progression">
          {children}
          {/* Bouton pour terminer la leçon afin d'afficher une modal*/}
          <FeedbacksButton
            className="btn btn-success text-nowrap text-success-content"
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
      )
    ) : (
      <button onClick={onNext} className="btn btn-primary text-base-100">
        Activité suivante
        <ArrowRight />
      </button>
    )}
  </div>
);

export default ActivityBottomNavigation;
