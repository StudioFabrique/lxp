import { Activity } from "../../../utils/interfaces/activity";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity-preview";
import { type PropsWithChildren, useCallback } from "react";
import Modal from "../../UI/modal/modal";
import ActivityActionsMenu from "./activity-actions-menu";
import activityIconType from "../../../utils/activity-icon-type";
import TiptapActivity from "../writing/tip-tap-activity";
import Lesson from "../../../utils/interfaces/lesson";
import ActivityDeleteModal from "./activity-delete-modal";

type PreviewLessonProps = {
  mode: "read" | "edit" | "write";
  selectedLesson?: Lesson;
  selectedActivity?: Activity;
  textActivityTitle?: string;
  textActivityContent?: string;
  showDeleteModal: boolean;
  onEditTitle: (title: string) => void;
  onEditContent: (content: string) => void;
  onRateActivity: (mode: "create" | "edit", rating: number) => void;
  onEditActivity: () => void;
  onOpenDeleteModal: () => void;
  onCloseDeleteModal: () => void;
  onDeleteActivity: () => void;
  onCloseTextEditor: () => void;
  onSaveActivity: (
    id: number | undefined,
    title: string,
    content: string
  ) => Promise<boolean>;
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  mode,
  selectedLesson,
  selectedActivity,
  textActivityTitle,
  textActivityContent,
  showDeleteModal,
  onEditContent,
  onEditTitle,
  onRateActivity,
  onEditActivity,
  onOpenDeleteModal,
  onCloseDeleteModal,
  onDeleteActivity,
  onCloseTextEditor,
  onSaveActivity,
  children,
}: PropsWithChildren<PreviewLessonProps>) => {
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
        <div className="w-full flex justify-end items-center">
          {selectedLesson?.lessonRating ? (
            <RatingPanelButton
              note={selectedLesson.lessonRating.rating}
              onRateContent={onRateActivity}
            />
          ) : null}
        </div>

        {/* Rendu de l'activité */}
        <div className="bg-base-100 border border-secondary/20 rounded-box p-4 mb-4">
          {selectedActivity && (
            <div className="font-semibold text-primary capitalize flex justify-between items-center gap-3">
              <span className="w-5">
                {activityIconType(selectedActivity.type)}
              </span>
              <span className="truncate text-ellipsis px-2">
                {textActivityTitle}
              </span>
              <ActivityActionsMenu
                activity={selectedActivity}
                onEditActivity={onEditActivity}
                onOpenDeleteModal={onOpenDeleteModal}
                disabled={mode !== "read"}
              />
            </div>
          )}

          {/* Afficher l'éditeur TipTap si le type de l'activité est "text" */}
          {selectedActivity?.type === "text" || mode === "write" ? (
            <div className="mt-4">
              <TiptapActivity
                key={`tiptap-${mode}-${selectedActivity?.id ?? "new"}`}
                mode={mode}
                id={selectedActivity?.id}
                title={textActivityTitle}
                content={textActivityContent}
                onEditTitle={onEditTitle}
                onEditContent={onEditContent}
                onClose={onCloseTextEditor}
                onSave={onSaveActivity}
              />
            </div>
          ) : (
            /* Sinon afficher l'activité d'un autre type "video", "image" ou "resources" */
            <ActivityPreview activity={selectedActivity} />
          )}
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-end items-center my-5">{children}</div>
      </div>
    </>
  );
};

export default LessonReader;
