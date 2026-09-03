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
import { ActivitySelectMode } from "../../store/module-explorer-reducer";
import Modal from "../../../../components/UI/modal/modal";
import Video from "../../../lesson/components/edit/activities/video";
import ImageActivityEditor from "../../../lesson/components/edit/activities/image/image-activity-editor";
import ResourcePreview from "../../../lesson/components/edit/activities/resources/preview/resource-preview";
import ResourceUpload from "../../../lesson/components/edit/activities/resources/resource-upload";

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
  onRefreshActivity: (selectLastActivity?: boolean) => Promise<boolean>;
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
  onRefreshActivity,
  onSaveActivity,
  children,
}: PropsWithChildren<Props>) => {
  const [headerSticky, setHeaderSticky] = useState(false);

  const hasOwnEditorHeader =
    canEdit &&
    (mode === "write" || mode === "edit") &&
    ["video", "image"].includes(activityType);
  const isResourceEditor =
    canEdit &&
    (mode === "write" || mode === "edit") &&
    activityType === "resource";

  const handleMediaSaved = useCallback(async () => {
    await onRefreshActivity(mode === "write");
  }, [mode, onRefreshActivity]);

  const handleFinishResourceEditing = useCallback(async () => {
    if (mode === "edit") {
      const saved = await onSaveActivity(
        selectedActivity?.id,
        textActivityTitle,
      );
      if (!saved) return;
    }
    await onRefreshActivity(false);
  }, [
    mode,
    onRefreshActivity,
    onSaveActivity,
    selectedActivity?.id,
    textActivityTitle,
  ]);

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
        <div
          className="bg-base-200 border border-base-300 rounded-lg p-6 mb-4 shadow-sm relative"
          data-onboarding={
            activityType === "text" && mode === "write"
              ? "text-editor"
              : undefined
          }
        >
          {/* Header de l'activité : titre et menu contextuel */}
          {isResourceEditor ? (
            <ActivityHeader
              title={textActivityTitle || "Ressources"}
              activityType="resource"
              titleEditable
              autoFocusTitle={mode === "write"}
              titleError={textActivityTitleError}
              onEditTitle={onEditTitle}
              className="font-semibold text-primary flex justify-between items-center mb-6"
              titleClassName="text-2xl font-bold first-letter:uppercase"
              cancelLabel={mode === "edit" ? "Terminer" : "Annuler"}
              cancelClassName={
                mode === "edit"
                  ? "btn btn-primary text-base-100"
                  : "btn btn-warning"
              }
              cancelDisabled={isLoading}
              onCancel={mode === "edit" ? handleFinishResourceEditing : onBack}
            />
          ) : !hasOwnEditorHeader &&
            canEdit &&
            (mode === "write" || mode === "edit") ? (
            <ActivityHeader
              title={textActivityTitle || ""}
              activityType={activityType}
              titleEditable
              autoFocusTitle={mode === "write"}
              titleError={textActivityTitleError}
              onEditTitle={onEditTitle}
              className="font-semibold flex justify-between items-center mb-6"
              titleClassName="text-2xl font-bold flex-1"
              cancelLabel="Annuler"
              cancelClassName="btn btn-sm btn-error text-base-100"
              cancelDisabled={isLoading}
              onCancel={mode === "write" ? onBack : onClose}
              enableSticky
              onStickyChange={setHeaderSticky}
            />
          ) : !hasOwnEditorHeader ? (
            <ActivityHeader
              title={textActivityTitle ?? ""}
              activityType={activityType}
              className="font-semibold text-primary flex justify-between items-center mb-6"
              titleClassName="text-2xl font-bold first-letter:uppercase"
              enableSticky
            >
              {selectedActivity && canEdit && (
                <ActivityActionsMenu
                  activity={selectedActivity}
                  onEditActivity={onEditActivity}
                  onOpenDeleteModal={onOpenDeleteModal}
                  disabled={mode !== "read"}
                />
              )}
            </ActivityHeader>
          ) : null}

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
              key={selectedActivity?.id ?? "new-iframe"}
              mode={mode}
              src={iframeActivitySrc}
              onChangeSrc={onEditIframeSrc}
              onSave={onSaveActivity}
              onFinishSaving={onClose}
            />
          ) : activityType === "video" && hasOwnEditorHeader ? (
            <Video
              key={selectedActivity?.id ?? "new-video"}
              activity={selectedActivity}
              isEditing={mode === "edit"}
              parentId={selectedLesson?.id}
              parent="lesson"
              onCancel={mode === "write" ? onBack : onClose}
              onSaved={handleMediaSaved}
            />
          ) : activityType === "image" && hasOwnEditorHeader ? (
            <ImageActivityEditor
              key={selectedActivity?.id ?? "new-image"}
              activity={selectedActivity}
              parentId={selectedLesson?.id}
              parent="lesson"
              onCancel={() => (mode === "write" ? onBack() : onClose())}
              onSaved={handleMediaSaved}
            />
          ) : activityType === "resource" && isResourceEditor ? (
            mode === "write" ? (
              <ResourceUpload
                parentId={selectedLesson?.id}
                parent="lesson"
                title={textActivityTitle}
                onCancel={() => onBack()}
                onSaved={handleMediaSaved}
              />
            ) : selectedActivity ? (
              <ResourcePreview
                activity={selectedActivity}
                parent="lesson"
                onCancel={() => undefined}
              />
            ) : null
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
