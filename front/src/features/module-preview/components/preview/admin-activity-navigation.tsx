import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  modalVisibility: "deletionModal" | "lessonCompletionModal" | "none";
  isFirstActivitySelected: boolean;
  isLastActivitySelected: boolean;
  isLastLessonOfCurrentCourse: boolean;
  hasNextLesson: boolean;
  onPreviousActivity: () => void;
  onNextActivity: () => void;
  onNextLesson: () => void;
};

const AdminActivityNavigation = ({
  modalVisibility,
  isFirstActivitySelected,
  isLastActivitySelected,
  isLastLessonOfCurrentCourse,
  hasNextLesson,
  onPreviousActivity,
  onNextActivity,
  onNextLesson,
}: Props) => (
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

    <div className="mr-5 flex flex-1 justify-end">
      {isLastActivitySelected ? (
        hasNextLesson && (
          <button
            type="button"
            className="btn btn-primary text-nowrap text-base-100"
            disabled={modalVisibility !== "none"}
            onClick={onNextLesson}
          >
            {isLastLessonOfCurrentCourse ? "Cours suivant" : "Leçon suivante"}
            <ArrowRight />
          </button>
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

export default AdminActivityNavigation;
