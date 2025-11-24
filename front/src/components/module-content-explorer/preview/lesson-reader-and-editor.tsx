import { Activity, ActivityType } from "../../../utils/interfaces/activity";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import { type PropsWithChildren, useCallback } from "react";
import Modal from "../../UI/modal/modal";
import ActivityActionsMenu from "./activity-actions-menu";
import activityIconType from "../../../utils/activity-icon-type";
import TiptapActivity from "../writing/tip-tap-activity";
import Lesson from "../../../utils/interfaces/lesson";
import ActivityDeleteModal from "./activity-delete-modal";
import { ActivitySelectMode } from "../../../views/module-content-explorer/store/module-explorer-reducer";
import ActivityPreview from "./activity-preview";
import IframeActivity from "./iframe-activity";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";

type Props = {
  mode: ActivitySelectMode;
  isLessonCompleted: boolean;
  selectedLesson?: Lesson;
  selectedActivity?: Activity;
  activityType: ActivityType;
  textActivityTitle?: string;
  textActivityTitleError?: string;
  textActivityContent?: string;
  iframeActivitySrc?: string;
  showDeleteModal: boolean;
  onEditTitle: (title: string) => void;
  onEditContent: (content: string) => void;
  onEditIframeSrc: (src: string) => void;
  onRateActivity: (rating: number) => void;
  onEditActivity: () => void;
  onOpenDeleteModal: () => void;
  onDeleteActivity: () => void;
  onCloseDeleteModal: () => void;
  onClose: () => void;
  onBack: () => void;
  onSaveActivity: () => Promise<boolean>;
};

// Composant pour prévisualiser et editer une leçon avec son activité selectionné
const LessonReaderAndEditor = ({
  mode,
  isLessonCompleted,
  selectedLesson,
  selectedActivity,
  activityType,
  textActivityTitle,
  textActivityTitleError,
  iframeActivitySrc,
  textActivityContent,
  showDeleteModal,
  onEditContent,
  onEditTitle,
  onEditIframeSrc,
  onRateActivity,
  onEditActivity,
  onOpenDeleteModal,
  onCloseDeleteModal,
  onDeleteActivity,
  onClose,
  onBack,
  onSaveActivity,
  children,
}: PropsWithChildren<Props>) => {
  const handleConfirmDelete = useCallback(() => {
    onDeleteActivity();
  }, [onDeleteActivity]);

  return (
    <>
      {showDeleteModal && selectedActivity && (
        <Modal title="Supprimer l'activité" leftLabel="Annuler">
          <ActivityDeleteModal
            onCloseDeleteModal={onCloseDeleteModal}
            onConfirmDelete={handleConfirmDelete}
            textActivityTitle={textActivityTitle}
          />
        </Modal>
      )}

      <div className="flex flex-col gap-5">
        {isLessonCompleted && selectedLesson?.lessonRating[0]?.rating && (
          <div className="w-full flex justify-end items-center">
            <RatingPanelButton
              note={selectedLesson.lessonRating[0].rating}
              onRateContent={onRateActivity}
            />
          </div>
        )}

        {/* Rendu de l'activité */}
        <div className="bg-base-100 border border-secondary/20 rounded-box p-4 mb-4">
          {/* Header de l'activité : titre et menu contextuel */}

          <div className="font-semibold text-primary flex justify-between items-center gap-3">
            <span className="w-5">{activityIconType(activityType)}</span>
            <span className="truncate text-ellipsis text-2xl px-2">
              {toUpperFirstLetter(textActivityTitle)}
            </span>
            <span className="flex-1" />
            {selectedActivity && (
              <ActivityActionsMenu
                activity={selectedActivity}
                onEditActivity={onEditActivity}
                onOpenDeleteModal={onOpenDeleteModal}
                disabled={mode !== "read"}
              />
            )}
          </div>

          {/* Afficher l'éditeur TipTap si le type de l'activité est "text" */}
          {activityType === "text" ? (
            <div className="mt-4">
              <TiptapActivity
                key={`tiptap-${mode}`}
                mode={mode}
                id={selectedActivity?.id}
                title={textActivityTitle}
                titleError={textActivityTitleError}
                content={textActivityContent}
                onEditTitle={onEditTitle}
                onEditContent={onEditContent}
                onSave={onSaveActivity}
                onFinishSaving={onClose}
              />
            </div>
          ) : activityType === "iframe" ? (
            /* Si "iframe", afficher l'éditeur iframe */
            <IframeActivity
              mode={mode}
              title={textActivityTitle}
              src={iframeActivitySrc}
              onEditTitle={onEditTitle}
              onChangeSrc={onEditIframeSrc}
              onSave={onSaveActivity}
              onFinishSaving={onClose}
            />
          ) : (
            /* Sinon afficher l'activité d'un autre type "video", "image" ou "resources" */
            <ActivityPreview activity={selectedActivity} />
          )}
        </div>

        {(mode === "write" || mode === "edit") && (
          <button
            className="btn btn-error self-end text-base-100"
            onClick={mode === "write" ? onBack : onClose}
          >
            Annuler
          </button>
        )}

        {/* Boutons de navigation */}
        <div className="flex justify-end items-center">{children}</div>
      </div>
    </>
  );
};

export default LessonReaderAndEditor;
