import { Activity } from "../../../utils/interfaces/activity";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity-preview";
import { type PropsWithChildren, useState, useCallback } from "react";
import Modal from "../../UI/modal/modal";
import ActivityActionsMenu from "./activity-actions-menu";
import activityIconType from "../../../utils/activity-icon-type";
import TiptapActivity from "../writing/tip-tap-activity";

type PreviewLessonProps = {
  textActivityContent?: string;
  onRateActivity: (rating: number) => void;
  onDeleteActivity: (activity: Activity) => void;
};

// Composant pour prévisualiser une leçon avec ses activités
const LessonReader = ({
  onRateActivity,
  onDeleteActivity,
  children,
}: PropsWithChildren<PreviewLessonProps>) => {
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null
  );

  const handleConfirmDelete = useCallback(() => {
    if (activityToDelete?.id) {
      onDeleteActivity(activityToDelete);
    }
    setActivityToDelete(null);
  }, [activityToDelete, onDeleteActivity]);

  if (!selectedLesson.id) return null;

  return (
    <>
      {showDeleteModal && activityToDelete && (
        <Modal
          title="Supprimer l'activité"
          leftLabel="Annuler"
          onMinimizeClick={() => {
            setShowDeleteModal(false);
            setActivityToDelete(null);
          }}
        >
          <div className="flex flex-col gap-4 items-center pt-10 px-5">
            <p className="text-center">
              Êtes-vous sûr de vouloir supprimer l'activité "
              {activityToDelete.title}" ? Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setShowDeleteModal(false);
                  setActivityToDelete(null);
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
          {/* Bouton de notation */}
          {currentLessonRating && lessonHasActivities ? (
            <RatingPanelButton
              note={currentLessonRating}
              onRateContent={onRateActivity}
            />
          ) : null}
        </div>

        {/* Rendu de l'activité */}
        <div className="bg-base-100 border border-secondary/20 rounded-box p-4 mb-4">
          <div className="font-semibold text-primary capitalize flex justify-between items-center gap-3">
            {activityIconType(selectedActivity.type)}
            {selectedActivity.title}
            <ActivityActionsMenu
              activity={selectedActivity}
              handleEditActivity={handleEditActivity}
              handleOpenDeleteModal={handleOpenDeleteModal}
              disabled={editingActivity?.id === selectedActivity.id}
            />
          </div>

          {/* Afficher l'éditeur TipTap si le type de l'activité est "text" */}
          {editingActivity?.type === "text" ? (
            <div className="mt-4">
              <TiptapActivity
                mode="read"
                id={selectedActivity.id}
                title={selectedActivity.title}
                content={textActivityContent}
                onClose={() => {}}
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
