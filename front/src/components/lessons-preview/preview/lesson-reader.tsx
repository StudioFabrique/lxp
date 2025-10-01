import type Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity-preview";
import TipTapActivity from "../writing/tip-tap-activity";
import { ACTIVITIES } from "../../../config/urls";
import {
  type PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from "react";
import Modal from "../../UI/modal/modal";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import ActivityActionsMenu from "./activity-actions-menu";
import activityIconType from "../../../utils/activity-icon-type";

type PreviewLessonProps = {
  selectedLesson: Lesson;
  selectedActivity: Activity;
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
  selectedActivity,
  currentLessonRating,
  onRateContent,
  onRefreshAllData,
  lessonHasActivities,
  children,
}: PropsWithChildren<PreviewLessonProps>) => {
  const [showTipTapEditor, setShowTipTapEditor] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityContent, setActivityContent] = useState<string>("");

  const [activities, setActivities] = useState<Activity[]>([]);
  const [deletingActivityId, setDeletingActivityId] = useState<number | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null
  );
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { sendRequest, error } = useHttp();

  const handleDeleteActivity = useCallback(
    (activityId: number) => {
      const activity = activities.find((item) => item.id === activityId);
      if (!activity) return;

      // Empêcher les appels multiples
      if (deletingActivityId === activityId) {
        console.log("Suppression déjà en cours pour cette activité");
        return;
      }

      setDeletingActivityId(activityId);

      // Appel au backend avec gestion d'erreur
      const applyData = () => {
        // Suppression réussie - retirer de l'état local
        const updatedActivities = activities.filter(
          (item) => item.id !== activityId
        );
        setActivities(updatedActivities);
        setDeletingActivityId(null);
        toast.success("Activité supprimée");

        // Backend confirmé - rafraîchir les données pour s'assurer de la synchronisation
        if (onRefreshAllData) {
          onRefreshAllData();
        }
      };

      sendRequest(
        { path: `/activity/${activity.type}/${activityId}`, method: "delete" },
        applyData
      );
    },
    [activities, deletingActivityId, sendRequest, onRefreshAllData]
  );

  const handleEditActivity = useCallback(
    (activity: Activity) => {
      // Gérer l'édition pour tous les types d'activités
      if (["text", "video", "image", "resource"].includes(activity.type)) {
        // Passer en mode édition pour cette activité
        setEditingActivity(activity);
        // Fermer l'éditeur de création si il est ouvert
        if (showTipTapEditor) {
          setShowTipTapEditor(false);
        }
      } else {
        console.log(
          "Édition non implémentée pour ce type d'activité:",
          activity.type
        );
      }
    },
    [showTipTapEditor]
  );

  const handleOpenDeleteModal = useCallback((activity: Activity) => {
    setActivityToDelete(activity);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (activityToDelete?.id) {
      handleDeleteActivity(activityToDelete.id);
    }
    setShowDeleteModal(false);
    setActivityToDelete(null);
  }, [activityToDelete, handleDeleteActivity]);

  // Effet pour récupérer le contenu de l'activité en cours d'édition
  useEffect(() => {
    if (editingActivity?.type === "text" && editingActivity.url) {
      fetch(`${ACTIVITIES}${editingActivity.url}`)
        .then((response) => response.text())
        .then((content: string) => {
          setActivityContent(content);
        });
    }
  }, [editingActivity]);

  // Initialiser les activités depuis la prop
  useEffect(() => {
    if (selectedLesson.activities) {
      setActivities([...selectedLesson.activities]);
    }
  }, [selectedLesson]);

  // Gérer les erreurs de suppression
  useEffect(() => {
    if (error) {
      setDeletingActivityId(null); // Réinitialiser l'état de suppression en cas d'erreur
      toast.error("Erreur lors de la suppression de l'activité");
    }
  }, [error]);

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
              onRateContent={onRateContent}
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
              setOpenMenuId={setOpenMenuId}
              openMenuId={openMenuId}
              handleEditActivity={handleEditActivity}
              handleOpenDeleteModal={handleOpenDeleteModal}
            />
          </div>

          {/* Afficher l'éditeur TipTap si l'activité est en cours d'édition */}
          {editingActivity?.id === selectedActivity.id ? (
            <div className="mt-4">
              <TipTapActivity
                parentId={selectedLesson.id ?? 0}
                activity={{
                  ...selectedActivity,
                  content: activityContent
                }}
                isNewActivity={false}
                shouldStartEdit={true}
                onRefreshAllData={onRefreshAllData}
                onActivityEditChange={(isEditing) => {
                  if (!isEditing) {
                    setEditingActivity(null);
                  }
                }}
              />
            </div>
          ) : (
            <ActivityPreview
              lessonId={selectedLesson.id ?? 0}
              activity={selectedActivity}
            />
          )}
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-end items-center my-5">{children}</div>
      </div>
    </>
  );
};

export default LessonReader;
