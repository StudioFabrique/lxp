import type Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";
import RatingPanelButton from "../../UI/lesson-rating/rating-panel-button";
import ActivityPreview from "./activity";
import {
  type PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from "react";
import Can from "../../UI/can/can.component";
import NoActivityPlaceholder from "./no-activity-placeholder";
import ActivityCreationOptionsButtons from "../writing/activity-creation-options-buttons";
import TipTapActivityWriting from "../writing/tip-tap-activity";
import { DndWrapper } from "../../UI/DndWrapper";
import { useDragAndDrop } from "../../../hooks/useDragAndDrop";
import {
  LayoutGrid,
  Check,
  Text,
  Youtube,
  Image,
  ActivityIcon,
  List,
} from "lucide-react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";

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
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(null);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { sendRequest } = useHttp();

  const activityIconType = (type: Activity["type"]) => {
    switch (type) {
      case "text":
        return <Text className="w-5 h-5" />;
      case "video":
        return <Youtube className="w-5 h-5" />;
      case "image":
        return <Image className="w-5 h-5" />;
      case "resource":
        return <ActivityIcon className="w-5 h-5" />;
      default:
        return <ActivityIcon className="w-5 h-5" />;
    }
  };

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
    setShowTipTapEditor(true);
  };

  const handleCloseTipTapEditor = () => {
    setShowTipTapEditor(false);
    setIsAnyActivityBeingEdited(false);
  };

  const handleDeleteActivity = (activityId: number) => {
    const activity = activities.find((item) => item.id === activityId);
    if (!activity) return;

    // Suppression instantanée dans le front
    const updatedActivities = activities.filter(
      (item) => item.id !== activityId
    );
    setActivities(updatedActivities);
    toast.success("Activité supprimée");

    // Appel au backend en arrière-plan
    const applyData = () => {
      // Backend confirmé - rafraîchir les données pour s'assurer de la synchronisation
      if (onRefreshAllData) {
        onRefreshAllData();
      }
    };

    sendRequest(
      { path: `/activity/${activity.type}/${activityId}`, method: "delete" },
      applyData
    );
  };

  const handleAccordionToggle = (activityId: number) => {
    // Si une activité est en cours d'édition ou en mode réorganisation, empêcher le changement d'accordéon
    if (isAnyActivityBeingEdited || isReorderMode) {
      return;
    }

    // Toggle: si l'accordéon est déjà ouvert, le fermer, sinon l'ouvrir
    setOpenAccordionId(openAccordionId === activityId ? null : activityId);
  };

  // Initialiser les activités depuis la prop
  useEffect(() => {
    if (selectedLesson.activities) {
      setActivities([...selectedLesson.activities]);
    }
  }, [selectedLesson.activities]);

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
    <div className="flex flex-col gap-5">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Activités</h1>
        {selectedLesson.activities && selectedLesson.activities?.length > 0 && (
          <Can action="update" object="lesson">
            <button
              onClick={handleToggleReorderMode}
              className="btn tooltip tooltip-left flex items-center gap-2"
              data-tip={
                isReorderMode
                  ? "Terminer la réorganisation"
                  : "Réorganiser les activités"
              }
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
              className="collapse collapse-arrow bg-base-100 border border-secondary/20 rounded-box"
              key={activity.id}
            >
              <input
                type="checkbox"
                name="my-accordion-2"
                checked={openAccordionId === activity.id}
                onChange={() => handleAccordionToggle(activity.id)}
                disabled={
                  isAnyActivityBeingEdited && openAccordionId !== activity.id
                }
              />

              <div
                className="collapse-title font-semibold text-primary capitalize cursor-pointer flex items-center gap-3"
                onClick={() => handleAccordionToggle(activity.id)}
              >
                {activityIconType(activity.type)}
                {activity.title}
              </div>

              <div className="collapse-content">
                <ActivityPreview
                  lessonId={selectedLesson.id ?? 0}
                  activity={activity}
                  isAnyActivityBeingEdited={isAnyActivityBeingEdited}
                  onActivityEditChange={setIsAnyActivityBeingEdited}
                  onDeleteActivity={handleDeleteActivity}
                />
              </div>
            </div>
          ))
        )
      ) : (
        <NoActivityPlaceholder />
      )}

      <Can action="write" object="lesson">
        {showTipTapEditor ? (
          <TipTapActivityWriting
            lessonId={selectedLesson.id}
            isNewActivity
            onCloseTipTapEditor={handleCloseTipTapEditor}
            onRefreshAllData={onRefreshAllData}
            isAnyActivityBeingEdited={isAnyActivityBeingEdited}
            onActivityEditChange={setIsAnyActivityBeingEdited}
          />
        ) : (
          <ActivityCreationOptionsButtons
            onClickShowTipTapEditor={handleClickShowTipTapEditor}
            selectedLesson={selectedLesson}
            isDisabled={isAnyActivityBeingEdited || isReorderMode}
          />
        )}
      </Can>

      {/* Boutons de navigation */}
      <div className="flex justify-end items-center my-5">{children}</div>
    </div>
  );
};

export default LessonReader;
