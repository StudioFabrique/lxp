import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "../../../../utils/cn";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import FeedbacksButton from "../../../../../src/components/buttons/FeedbacksButton";
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
  <div className={cn("flex justify-between items-center w-full gap-5")}>
    {/* Bouton Précédent */}
    <div className="flex-1 flex justify-start">
      {!isFirstActivitySelected && (
        <button onClick={onPrevious} className="btn btn-primary text-base-100">
          <ArrowLeft />
          Activité précédente
        </button>
      )}
    </div>

    {/* Bouton central */}
    <div className="flex-initial">
      <PermissionGuard action="component" object="progression">
        {children}
      </PermissionGuard>
    </div>

    {/* Bouton Suivant ou Terminer */}
    <div className="flex-1 flex justify-end mr-5">
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
          </PermissionGuard>
        )
      ) : (
        <button onClick={onNext} className="btn btn-primary text-base-100">
          Activité suivante
          <ArrowRight />
        </button>
      )}
    </div>
  </div>
);

export default ActivityBottomNavigation;
