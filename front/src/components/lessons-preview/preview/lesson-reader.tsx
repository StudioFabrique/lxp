import type Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity-preview";
import {
  type PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from "react";
import Can from "../../UI/can/can.component";
import Modal from "../../UI/modal/modal";
import NoActivityPlaceholder from "./no-activity-placeholder";
import ActivityCreationOptionsButtons from "../writing/activity-creation-options-buttons";
import TipTapActivityWriting from "../writing/tip-tap-activity";
import { DndWrapper } from "../../UI/DndWrapper";
import { useDragAndDrop } from "../../../hooks/useDragAndDrop";
import { LayoutGrid, Check, List } from "lucide-react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import ActivityActionsMenu from "./activity-actions-menu";
import activityIconType from "../../../utils/activity-icon-type";

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

  const [editingActivityId, setEditingActivityId] = useState<number | null>(
    null
  );
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
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

  // Hook pour gérer le drag and drop
  const { handleDragEnd, submit, setSubmit } = useDragAndDrop({
    items: activities,
    onReorder: setActivities,
  });

  // Fonction pour gérer la réorganisation des activités
  const handleReorderActivities = useCallback(
    (activitiesIds: number[]) => {
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
          setSubmit(false);
          if (onRefreshAllData) {
            onRefreshAllData();
          }
        }
      };

      sendRequest(
        {
          path: `/activity/reorder/${selectedLesson.id}`,
          method: "put",
          body: activitiesIds,
        },
        applyData
      );
    },
    [selectedLesson.id, sendRequest, setSubmit, onRefreshAllData]
  );

  const handleClickShowTipTapEditor = () => {
    // Si une activité est en cours d'édition, la fermer automatiquement
    if (editingActivityId !== null) {
      setEditingActivityId(null);
    }
    setShowTipTapEditor(true);
  };

  const handleCloseTipTapEditor = () => {
    setShowTipTapEditor(false);
  };

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
        // Fermer l'éditeur de création si il est ouvert
        if (showTipTapEditor) {
          setShowTipTapEditor(false);
        }
        // Ouvrir l'activité dans l'accordéon si elle n'est pas déjà ouverte
        setOpenAccordionId(activity.id);
        // Signaler que cette activité doit être éditée
        setEditingActivityId(activity.id);
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

  const handleAccordionToggle = (activityId: number) => {
    // Toggle: si l'accordéon est déjà ouvert, le fermer, sinon l'ouvrir
    setOpenAccordionId(openAccordionId === activityId ? null : activityId);
  };

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

  // Envoyer la réorganisation quand submit change
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submit) {
      timer = setTimeout(() => {
        const activitiesIds = activities.map((activity) => activity.id!);
        handleReorderActivities(activitiesIds);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [submit, activities, handleReorderActivities]);

  // Ouvrir le premier accordéon par défaut au chargement
  useEffect(() => {
    if (
      selectedLesson.activities &&
      selectedLesson.activities.length > 0 &&
      !isReorderMode
    ) {
      setOpenAccordionId(selectedLesson.activities[0].id);
    }
  }, [selectedLesson.activities, isReorderMode]);

  const handleToggleReorderMode = () => {
    setIsReorderMode(!isReorderMode);
    if (!isReorderMode) {
      // En entrant en mode réorganisation, fermer tous les accordéons
      setOpenAccordionId(null);
    } else {
      // En sortant du mode réorganisation, ouvrir le premier accordéon
      if (selectedLesson.activities && selectedLesson.activities.length > 0) {
        setOpenAccordionId(selectedLesson.activities[0].id);
      }
    }
  };

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
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Activités</h1>
          {selectedLesson.activities &&
            selectedLesson.activities?.length > 0 && (
              <Can action="update" object="lesson">
                <button
                  onClick={handleToggleReorderMode}
                  className="btn tooltip tooltip-left flex items-center gap-2"
                >
                  {isReorderMode ? (
                    <>
                      <Check className="w-5 h-5 text-success" />
                      Terminer la réorganisation
                    </>
                  ) : (
                    <>
                      <List className="w-5 h-5" />
                      Réorganiser les activités
                    </>
                  )}
                </button>
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
          isReorderMode ? (
            // Mode réorganisation avec drag and drop
            <DndWrapper
              droppableId="activities-reorder"
              items={activities}
              onDragEnd={handleDragEnd}
              isLoading={false}
              renderItem={(activity, index) => (
                <div className="card bg-base-100 border border-secondary/20 rounded-box p-4">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="flex flex-col">
                      <span className="text-sm text-base-content/60">
                        {index + 1}
                      </span>
                    </div>
                    {activityIconType(activity.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary capitalize">
                        {activity.title}
                      </h3>
                    </div>
                    <div className="cursor-grab active:cursor-grabbing">
                      <LayoutGrid className="w-5 h-5 text-base-content/50" />
                    </div>
                  </div>
                </div>
              )}
            />
          ) : (
            // Mode normal avec accordéons
            selectedLesson.activities?.map((activity) => (
              <div
                className="collapse collapse-arrow bg-base-100 border border-secondary/20 rounded-box relative"
                key={activity.id}
              >
                <input
                  type="checkbox"
                  name="my-accordion-2"
                  checked={openAccordionId === activity.id}
                  onChange={() => handleAccordionToggle(activity.id)}
                />

                <div className="collapse-title font-semibold text-primary capitalize cursor-pointer flex items-center gap-3">
                  {activityIconType(activity.type)}
                  {activity.title}
                </div>

                {/* Menu d'actions positionné en absolu sur le collapse */}
                {openAccordionId === activity.id && (
                  <ActivityActionsMenu
                    activity={activity}
                    setOpenMenuId={setOpenMenuId}
                    openMenuId={openMenuId}
                    handleEditActivity={handleEditActivity}
                    handleOpenDeleteModal={handleOpenDeleteModal}
                  />
                )}
                <div className="collapse-content">
                  <ActivityPreview
                    lessonId={selectedLesson.id ?? 0}
                    activity={activity}
                    onActivityEditChange={(isEditing) => {
                      if (!isEditing) {
                        if (editingActivityId === activity.id) {
                          setEditingActivityId(null);
                        }
                      }
                    }}
                    shouldEdit={editingActivityId === activity.id}
                    forceStopEdit={
                      (editingActivityId !== null &&
                        editingActivityId !== activity.id) ||
                      showTipTapEditor
                    }
                  />
                </div>
              </div>
            ))
          )
        ) : (
          <NoActivityPlaceholder>
            <ActivityCreationOptionsButtons
              variant="no-activity"
              onClickShowTipTapEditor={handleClickShowTipTapEditor}
              selectedLesson={selectedLesson}
              isDisabled={Boolean(editingActivityId)}
            />
          </NoActivityPlaceholder>
        )}

        <Can action="write" object="lesson">
          {showTipTapEditor ? (
            <TipTapActivityWriting
              parentId={selectedLesson.id}
              isNewActivity
              onCloseTipTapEditor={handleCloseTipTapEditor}
              onRefreshAllData={onRefreshAllData}
            />
          ) : isReorderMode || !lessonHasActivities ? null : (
            <ActivityCreationOptionsButtons
              onClickShowTipTapEditor={handleClickShowTipTapEditor}
              selectedLesson={selectedLesson}
              isDisabled={Boolean(editingActivityId)}
            />
          )}
        </Can>

        {/* Boutons de navigation */}
        <div className="flex justify-end items-center my-5">{children}</div>
      </div>
    </>
  );
};

export default LessonReader;
