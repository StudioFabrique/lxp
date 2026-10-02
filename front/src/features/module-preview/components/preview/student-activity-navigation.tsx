import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { PropsWithChildren } from "react";
import FeedbacksButton from "../../../../components/buttons/FeedbacksButton";
import { cn } from "../../../../utils/cn";

type Props = {
  modalVisibility: "deletionModal" | "lessonCompletionModal" | "none";
  isFirstActivitySelected: boolean;
  isLastActivitySelected: boolean;
  isLastLessonSelected: boolean;
  isLessonCompleted: boolean;
  areAllActivitiesRead: boolean;
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
  areAllActivitiesRead,
  onPreviousActivity,
  onNextActivity,
  onCompleteLesson,
  children,
}: PropsWithChildren<Props>) => {
  const isDisabled = modalVisibility !== "none" || (!isLessonCompleted && !areAllActivitiesRead);
  const disabledReason = !isLessonCompleted && !areAllActivitiesRead
    ? "Lisez toutes les activités de la leçon pour la terminer."
    : "Fermez la fenêtre ouverte pour continuer.";

  return (
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
        {children}
      </div>

      <div className="mr-5 flex flex-1 justify-end">
        {isLastActivitySelected ? (
          (!isLastLessonSelected || !isLessonCompleted) && (
            <div
              className={cn(isDisabled ? "tooltip tooltip-left" : undefined)}
              data-tip={isDisabled ? disabledReason : undefined}
            >
              <FeedbacksButton
                className="btn btn-success text-nowrap text-success-content"
                feedbackType="thumbUp"
                showFeedback={!isLessonCompleted}
                disabled={isDisabled}
                onClick={onCompleteLesson}
              >
                {isLessonCompleted ? (
                  <>
                    Leçon suivante
                    <ArrowRight />
                  </>
                ) : (
                  <>
                    {isDisabled ? <LockKeyhole aria-hidden="true" /> : <Check aria-hidden="true" />}
                    Marquer comme terminé
                  </>
                )}
              </FeedbacksButton>
            </div>
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
};

export default StudentActivityNavigation;
