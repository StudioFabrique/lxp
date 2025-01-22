import Lesson from "../../../utils/interfaces/lesson";
import ActivityPreview from "./activity";
import EvaluateContentButton from "../../UI/evaluate-content-button";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  onFinishReadLesson: () => void;
};

const PreviewLesson = ({
  selectedLesson,
  onFinishReadLesson,
}: PreviewLessonProps) => {
  const hasActivities =
    selectedLesson.activities?.length && selectedLesson.activities?.length > 0;
  const isLessonCompleted = selectedLesson.lessonsRead?.some(
    (lessonRead) => lessonRead.finishedAt,
  );

  return (
    <div className="flex flex-col gap-4">
      {hasActivities ? (
        selectedLesson.activities?.map((activity) => (
          <ActivityPreview key={activity.id} activity={activity} />
        ))
      ) : (
        <p>Aucune activités</p>
      )}

      <div className="flex justify-end gap-5">
        <EvaluateContentButton note={1} sendEvaluation={() => {}} />
        <button
          className="btn btn-primary text-white self-end"
          onClick={onFinishReadLesson}
        >
          {isLessonCompleted ? "Leçon Suivante" : "Marquer comme terminé"}
        </button>
      </div>
    </div>
  );
};

export default PreviewLesson;
