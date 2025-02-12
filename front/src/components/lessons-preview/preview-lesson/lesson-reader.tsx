import Lesson from "../../../utils/interfaces/lesson";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity";
import { PropsWithChildren } from "react";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  currentLessonRating?: number;
  isLessonAlreadyCompleted: boolean;
  onRateContent: (rating: number) => void;
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  selectedLesson,
  currentLessonRating,
  onRateContent,
  children,
}: PropsWithChildren<PreviewLessonProps>) => {
  // Vérifie s'il y a des activités dans la leçon
  const hasActivities = Boolean(selectedLesson.activities?.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Bouton de notation */}
      <div className="w-full flex justify-end pr-10">
        {selectedLesson.activities &&
        currentLessonRating &&
        selectedLesson.activities?.length > 0 ? (
          <RatingPanelButton
            note={currentLessonRating}
            onRateContent={onRateContent}
          />
        ) : null}
      </div>

      {/* Affiche les activités si elles existent, sinon affiche un message */}
      {hasActivities ? (
        selectedLesson.activities?.map((activity) => (
          <ActivityPreview key={activity.id} activity={activity} />
        ))
      ) : (
        <p>Aucune activités</p>
      )}

      {/* Boutons de navigation */}
      <div className="flex justify-end items-center mt-4 pb-16">
        <div className="mr-10">{children}</div>
      </div>
    </div>
  );
};

export default LessonReader;
