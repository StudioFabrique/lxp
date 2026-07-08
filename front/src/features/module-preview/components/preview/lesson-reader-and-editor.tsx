import {
  Activity,
  ActivityType,
} from "../../../../../src/utils/interfaces/activity";
import RatingPanelButton from "../../../../../src.legacy/components/UI/lesson-rating/rating-panel-button";
import { type PropsWithChildren, useCallback } from "react";
import Modal from "../../../../../src.legacy/components/UI/modal/modal";
import ActivityActionsMenu from "./activity-actions-menu";
import activityIconType from "../../../../utils/helpers/activity-icon-type";
import TiptapActivity from "../writing/tip-tap-activity";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import ActivityDeleteModal from "./activity-delete-modal";
import ActivityPreview from "./activity-preview";
import IframeActivity from "./iframe-activity";
import { toUpperFirstLetter } from "../../../../../src/utils/helpers/text-helpers";
import { ActivitySelectMode } from "../../store/module-explorer-reducer";

type Props = {
  mode: ActivitySelectMode;
  canEdit?: boolean;
  isLessonCompleted: boolean;
  selectedLesson?: Lesson;
  selectedActivity?: Activity;
  activityType: ActivityType;
  textActivityTitle?: string;
  textActivityTitleError?: string;
  textActivityContent?: string;
  iframeActivitySrc?: string;
  showDeleteModal: boolean;
  isLoading?: boolean;
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
  onSaveActivity: (
    id?: number,
    title?: string,
    content?: string,
  ) => Promise<boolean>;
};

// Composant pour prévisualiser et editer une leçon avec son activité selectionné
const LessonReaderAndEditor = ({
  mode,
  canEdit,
  isLessonCompleted,
  selectedLesson,
  selectedActivity,
  activityType,
  textActivityTitle,
  textActivityTitleError,
  iframeActivitySrc,
  textActivityContent,
  showDeleteModal,
  isLoading,
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
      {showDeleteModal && selectedActivity && textActivityTitle && (
        <Modal title="Supprimer l'activité" leftLabel="Annuler">
          <ActivityDeleteModal
            onCloseDeleteModal={onCloseDeleteModal}
            onConfirmDelete={handleConfirmDelete}
            textActivityTitle={textActivityTitle}
            isOpen
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
        <div className="bg-base-200 border border-base-300 rounded-lg p-6 mb-4 shadow-sm">
          {/* Header de l'activité : titre et menu contextuel */}
          <div className="font-semibold text-primary flex justify-between items-center mb-6">
            <div className="flex gap-3 items-center w-[92%]">
              <span className="w-6">{activityIconType(activityType)}</span>
              <span className="text-2xl font-bold w-fit text-base-content">
                {toUpperFirstLetter(textActivityTitle)}
              </span>
            </div>
            <span className="flex-1" />
            {canEdit &&
              (mode === "write" || mode === "edit" ? (
                <button
                  className="btn btn-sm btn-error self-end text-base-100"
                  onClick={mode === "write" ? onBack : onClose}
                  disabled={isLoading}
                >
                  Annuler
                </button>
              ) : (
                selectedActivity && (
                  <ActivityActionsMenu
                    activity={selectedActivity}
                    onEditActivity={onEditActivity}
                    onOpenDeleteModal={onOpenDeleteModal}
                    disabled={mode !== "read"}
                  />
                )
              ))}
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

        {/* Boutons de navigation */}
        <div className="flex justify-end items-center">{children}</div>
      </div>
    </>
  );
};

export default LessonReaderAndEditor;
