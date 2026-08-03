import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PropsWithChildren } from "react";
import FeedbacksButton from "../../../../components/buttons/FeedbacksButton";
import PermissionGuard from "../../../../components/guards/PermissionGuard";

type Props = {
  modalVisibility: "deletionModal" | "lessonCompletionModal" | "none";
  isFirstActivitySelected: boolean;
  isLastActivitySelected: boolean;
  isLastLessonSelected: boolean;
  isLessonCompleted: boolean;
  onPreviousActivity: () => void;
  onNextActivity: () => void;
  onCompleteLesson: () => void;
};

const StudentActivityNavigation = ({
  modalVisibility,
  isFirstActivitySelected,
  isLastActivitySelected,
  isLastLessonSelected,
  isLessonCompleted,
  onPreviousActivity,
  onNextActivity,
  onCompleteLesson,
  children,
}: PropsWithChildren<Props>) => (
  <div className="flex w-full items-center justify-between gap-5">
    <div className="flex flex-1 justify-start">
      {!isFirstActivitySelected && (
        <button
          type="button"
          onClick={onPreviousActivity}
          className="btn btn-primary text-base-100"
        >
          <ArrowLeft />
          Activité précédente
        </button>
      )}
    </div>

    <div className="flex-initial">
      <PermissionGuard action="component" object="progression">
        {children}
      </PermissionGuard>
    </div>

    <div className="mr-5 flex flex-1 justify-end">
      {isLastActivitySelected ? (
        (!isLastLessonSelected || !isLessonCompleted) && (
          <PermissionGuard action="component" object="progression">
            <FeedbacksButton
              className="btn btn-success text-nowrap text-success-content"
              feedbackType="thumbUp"
              showFeedback={!isLessonCompleted}
              disabled={modalVisibility !== "none"}
              onClick={onCompleteLesson}
            >
              {isLessonCompleted ? (
                <>
                  Leçon suivante
                  <ArrowRight />
                </>
              ) : (
                <>
                  <Check />
                  Marquer comme terminé
                </>
              )}
            </FeedbacksButton>
          </PermissionGuard>
        )
      ) : (
        <button
          type="button"
          onClick={onNextActivity}
          className="btn btn-primary text-base-100"
        >
          Activité suivante
          <ArrowRight />
        </button>
      )}
    </div>
  </div>
);

export default StudentActivityNavigation;
