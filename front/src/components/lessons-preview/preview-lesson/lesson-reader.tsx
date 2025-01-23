import Lesson from "../../../utils/interfaces/lesson";
import ActivityPreview from "./activity";
import EvaluateContentButton from "../../UI/evaluate-content-button";
import { useState, useEffect } from "react";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  onFinishReadLesson: (showNextLesson: boolean) => void;
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  selectedLesson,
  onFinishReadLesson,
}: PreviewLessonProps) => {
  // Vérifie s'il y a des activités dans la leçon
  const hasActivities = Boolean(selectedLesson.activities?.length);

  // Vérifie si la leçon a déjà été complétée
  const [isLessonAlreadyCompleted, setIsLessonAlreadyCompleted] =
    useState(false);

  useEffect(() => {
    setIsLessonAlreadyCompleted(
      Boolean(
        selectedLesson.lessonsRead?.some((lessonRead) => lessonRead.finishedAt),
      ),
    );
  }, [selectedLesson.lessonsRead]);

  const handleClickNextLesson = () => {
    onFinishReadLesson(isLessonAlreadyCompleted);
    setIsLessonAlreadyCompleted(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Affiche les activités si elles existent, sinon affiche un message */}
      {hasActivities ? (
        selectedLesson.activities?.map((activity) => (
          <ActivityPreview key={activity.id} activity={activity} />
        ))
      ) : (
        <p>Aucune activités</p>
      )}

      {/* Boutons d'évaluation et de navigation */}
      <div className="flex justify-end gap-5">
        {isLessonAlreadyCompleted &&
        selectedLesson.activities &&
        selectedLesson.activities?.length > 0 ? (
          <EvaluateContentButton note={1} sendEvaluation={() => {}} />
        ) : null}
        <button
          className="btn btn-primary text-white self-end"
          onClick={handleClickNextLesson}
        >
          {isLessonAlreadyCompleted
            ? "Leçon Suivante"
            : "Marquer comme terminé"}
        </button>
      </div>
    </div>
  );
};

export default LessonReader;
