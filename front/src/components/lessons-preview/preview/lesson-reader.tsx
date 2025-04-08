import Lesson from "../../../utils/interfaces/lesson";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity";
import { PropsWithChildren, useState } from "react";
import Can from "../../UI/can/can.component";
import NoActivityPlaceholder from "./no-activity-placeholder";
import ActivityCreationOptionsButtons from "../writing/activity-creation-options-buttons";
import TipTapActivityWriting from "../writing/tip-tap-activity-writing";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  currentLessonRating?: number;
  isLessonAlreadyCompleted: boolean;
  onRateContent: (rating: number) => void;
  // Vérifie s'il y a des activités dans la leçon
  lessonHasActivities: boolean;
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  selectedLesson,
  currentLessonRating,
  onRateContent,
  lessonHasActivities,
  children,
}: PropsWithChildren<PreviewLessonProps>) => {
  const [showTipTapEditor, setShowTipTapEditor] = useState<boolean>(false);

  const handleClickShowTipTapEditor = () => {
    setShowTipTapEditor(true);
  };

  const handleCloseTipTapEditor = () => {
    setShowTipTapEditor(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          {selectedLesson.title}
        </h1>
        {/* Bouton de notation */}
        {currentLessonRating && lessonHasActivities ? (
          <RatingPanelButton
            note={currentLessonRating}
            onRateContent={onRateContent}
          />
        ) : null}
      </div>

      {/* Affiche les activités si elles existent, sinon affiche un message */}
      {lessonHasActivities ? (
        selectedLesson.activities?.map((activity) => (
          <ActivityPreview
            key={activity.id}
            lessonId={selectedLesson.id ?? 0}
            activity={activity}
          />
        ))
      ) : (
        <NoActivityPlaceholder />
      )}

      <Can action="write" object="lesson">
        {showTipTapEditor ? (
          <TipTapActivityWriting
            onCloseTipTapEditor={handleCloseTipTapEditor}
          />
        ) : (
          <ActivityCreationOptionsButtons
            onClickShowTipTapEditor={handleClickShowTipTapEditor}
            selectedLesson={selectedLesson}
          />
        )}
      </Can>

      {/* Boutons de navigation */}
      <div className="flex justify-end items-center my-5">{children}</div>
    </div>
  );
};

export default LessonReader;
