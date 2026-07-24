import {
  Activity,
  ActivityType,
} from "../../../../../src/utils/interfaces/activity";
import RatingPanelButton from "../../../../../src/components/UI/lesson-rating/rating-panel-button";
import { type PropsWithChildren, useCallback, useState } from "react";
import ActivityActionsMenu from "./activity-actions-menu";
import ActivityHeader from "../../../../features/lesson/components/edit/activities/activity-header";
import TiptapActivity from "../writing/tip-tap-activity";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import ActivityDeleteModal from "./activity-delete-modal";
import ActivityPreview from "./activity-preview";
import IframeActivity from "./iframe-activity";
import { toUpperFirstLetter } from "../../../../../src/utils/helpers/text-helpers";
import { ActivitySelectMode } from "../../store/module-explorer-reducer";
import Modal from "../../../../components/UI/modal/modal";

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
  const [headerSticky, setHeaderSticky] = useState(false);

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
        <div className="bg-base-200 border border-base-300 rounded-lg p-6 mb-4 shadow-sm relative">
          {/* Header de l'activité : titre et menu contextuel */}
          {canEdit && (mode === "write" || mode === "edit") ? (
            <ActivityHeader
              title={textActivityTitle || ""}
              activityType={activityType}
              titleEditable
              titleError={textActivityTitleError}
              onEditTitle={onEditTitle}
              className="font-semibold text-primary flex justify-between items-center mb-6"
              titleClassName="text-2xl font-bold flex-1"
              cancelLabel="Annuler"
              cancelClassName="btn btn-sm btn-error text-base-100"
              cancelDisabled={isLoading}
              onCancel={mode === "write" ? onBack : onClose}
              enableSticky
              onStickyChange={setHeaderSticky}
            />
          ) : (
            <ActivityHeader
              title={toUpperFirstLetter(textActivityTitle) ?? ""}
              activityType={activityType}
              className="font-semibold text-primary flex justify-between items-center mb-6"
              titleClassName="text-2xl font-bold"
              enableSticky
            >
              {selectedActivity && (
                <ActivityActionsMenu
                  activity={selectedActivity}
                  onEditActivity={onEditActivity}
                  onOpenDeleteModal={onOpenDeleteModal}
                  disabled={mode !== "read"}
                />
              )}
            </ActivityHeader>
          )}

          {/* Afficher l'éditeur TipTap si le type de l'activité est "text" */}
          {activityType === "text" ? (
            <div className="mt-4">
              <TiptapActivity
                key={`tiptap-${mode}`}
                mode={mode}
                id={selectedActivity?.id}
                title={textActivityTitle}
                content={textActivityContent}
                onEditTitle={onEditTitle}
                onEditContent={onEditContent}
                onSave={onSaveActivity}
                onFinishSaving={onClose}
                headerSticky={headerSticky}
              />
            </div>
          ) : activityType === "iframe" ? (
            /* Si "iframe", afficher l'éditeur iframe */
            <IframeActivity
              mode={mode}
              src={iframeActivitySrc}
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
