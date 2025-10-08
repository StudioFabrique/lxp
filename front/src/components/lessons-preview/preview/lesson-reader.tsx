import { Activity } from "../../../utils/interfaces/activity";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity-preview";
import { type PropsWithChildren, useCallback } from "react";
import Modal from "../../UI/modal/modal";
import ActivityActionsMenu from "./activity-actions-menu";
import activityIconType from "../../../utils/activity-icon-type";
import TiptapActivity from "../writing/tip-tap-activity";
import Lesson from "../../../utils/interfaces/lesson";

type PreviewLessonProps = {
  mode: "read" | "edit" | "write";
  selectedLesson: Lesson;
  selectedActivity?: Activity;
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
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  mode,
  selectedLesson,
  selectedActivity,
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
  children,
}: PropsWithChildren<PreviewLessonProps>) => {
  const handleConfirmDelete = useCallback(() => {
    onDeleteActivity();
  }, [onDeleteActivity]);

  return (
    <>
      {showDeleteModal && selectedActivity && (
        <Modal
          title="Supprimer l'activité"
          leftLabel="Annuler"
          onMinimizeClick={() => {
            onCloseDeleteModal();
          }}
        >
          <div className="flex flex-col gap-4 items-center pt-10 px-5">
            <p className="text-center">
              Êtes-vous sûr de vouloir supprimer l'activité "
              {selectedActivity.title}" ? Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  onCloseDeleteModal();
                }}
              >
                Annuler
              </button>
              <button
                className="btn btn-sm btn-error text-base-100"
                onClick={handleConfirmDelete}
              >
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex flex-col gap-5">
        <div className="w-full flex justify-end items-center">
          {selectedLesson.lessonRating ? (
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
              {activityIconType(selectedActivity.type)}
              {selectedActivity.title}
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
                mode={mode}
                id={selectedActivity?.id}
                title={selectedActivity?.title}
                content={textActivityContent}
                onEditTitle={onEditTitle}
                onEditContent={onEditContent}
                onClose={onCloseTextEditor}
                onSave={async () => {
                  // test
                  return false;
                }}
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
