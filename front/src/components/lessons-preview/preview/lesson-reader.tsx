import type Lesson from "../../../utils/interfaces/lesson";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity";
import { Fragment, type PropsWithChildren, useState } from "react";
import Can from "../../UI/can/can.component";
import NoActivityPlaceholder from "./no-activity-placeholder";
import ActivityCreationOptionsButtons from "../writing/activity-creation-options-buttons";
import TipTapActivityWriting from "../writing/tip-tap-activity";
import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  currentLessonRating?: number;
  isLessonAlreadyCompleted: boolean;
  onRateContent: (rating: number) => void;
  onRefreshAllData?: () => void;
  // Vérifie s'il y a des activités dans la leçon
  lessonHasActivities: boolean;
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  selectedLesson,
  currentLessonRating,
  onRateContent,
  onRefreshAllData,
  lessonHasActivities,
  children,
}: PropsWithChildren<PreviewLessonProps>) => {
  const [showTipTapEditor, setShowTipTapEditor] = useState<boolean>(false);
  const [isAnyActivityBeingEdited, setIsAnyActivityBeingEdited] =
    useState<boolean>(false);

  const handleClickShowTipTapEditor = () => {
    setShowTipTapEditor(true);
  };

  const handleCloseTipTapEditor = () => {
    setShowTipTapEditor(false);
    setIsAnyActivityBeingEdited(false);
  };

  if (!selectedLesson.id) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">
          {selectedLesson.title}
        </h1>
        {selectedLesson.activities && selectedLesson.activities?.length > 0 && (
          <Can action="update" object="lesson">
            <Link
              to={`/admin/lesson/edit/${selectedLesson.id}`}
              className="btn btn-ghost top-4 right-4 tooltip tooltip-left"
              data-tip="Réorganiser/Supprimer des activités"
            >
              <LayoutGrid className="w-5 h-5" />
            </Link>
          </Can>
        )}
        {/* Bouton de notation */}
        {currentLessonRating && lessonHasActivities ? (
          <RatingPanelButton
            note={currentLessonRating}
            onRateContent={onRateContent}
          />
        ) : null}
      </div>

      {/* Affiche les activités si elles existent, sinon affiche un message */}
      {lessonHasActivities || showTipTapEditor ? (
        selectedLesson.activities?.map((activity, i) => (
          <Fragment key={activity.id}>
            {i >= 1 && <hr className="w-[80%] self-center border-primary" />}
            <div className="flex justify-center text-primary capitalize">
              {activity.title}
            </div>

            <ActivityPreview
              lessonId={selectedLesson.id ?? 0}
              activity={activity}
              isAnyActivityBeingEdited={isAnyActivityBeingEdited}
              onActivityEditChange={setIsAnyActivityBeingEdited}
            />
          </Fragment>
        ))
      ) : (
        <NoActivityPlaceholder />
      )}

      <Can action="write" object="lesson">
        {showTipTapEditor ? (
          <TipTapActivityWriting
            parentId={selectedLesson.id}
            isNewActivity
            onCloseTipTapEditor={handleCloseTipTapEditor}
            onRefreshAllData={onRefreshAllData}
            isAnyActivityBeingEdited={isAnyActivityBeingEdited}
            onActivityEditChange={setIsAnyActivityBeingEdited}
            parent="lesson"
          />
        ) : (
          <ActivityCreationOptionsButtons
            onClickShowTipTapEditor={handleClickShowTipTapEditor}
            selectedLesson={selectedLesson}
            isDisabled={isAnyActivityBeingEdited}
          />
        )}
      </Can>

      {/* Boutons de navigation */}
      <div className="flex justify-end items-center my-5">{children}</div>
    </div>
  );
};

export default LessonReader;
