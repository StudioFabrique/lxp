// Ce composant fournit une fonctionnalité de drag & drop pour réorganiser une liste d'activités
// Il affiche les activités dans une liste qui peut être réorganisée en faisant glisser les éléments
// Un minuteur est utilisé pour sauvegarder automatiquement le nouvel ordre après le glisser-déposer
// Les activités peuvent aussi être supprimées individuellement

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import ActivityListItem from "./activity-list-item";
import Activity from "../../../utils/interfaces/activity";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Modal from "../../UI/modal/modal";

type Props = {
  activities: Activity[];
  setActivities: Dispatch<SetStateAction<Activity[]>>;
  onDeleteActivity: (activityId: number) => void;
  onReorderActivities: (activitiesIds: number[]) => void;
};

export default function DNDAcitivities(props: Props) {
  const [submit, setSubmit] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null
  );

  const handleReorder = useCallback(() => {
    const activitiesIds = props.activities.map((item) => item.id);
    props.onReorderActivities(activitiesIds);
    setSubmit(false);
  }, [props]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newActivities = Array.from(props.activities);
    const [movedActivity] = newActivities.splice(result.source.index, 1);
    newActivities.splice(result.destination.index, 0, movedActivity);
    props.setActivities(newActivities);
    setSubmit(true);
  };

  const deleteActivity = () => {
    props.onDeleteActivity(activityToDelete!.id!);
    setActivityToDelete(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submit) {
      timer = setTimeout(() => {
        handleReorder();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [handleReorder, submit]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="activities">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-y-2"
            >
              {props.activities.length > 0 ? (
                <>
                  {props.activities.map((activity, index) => (
                    <Draggable
                      key={activity.id}
                      draggableId={activity.id!.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Wrapper>
                            <ActivityListItem
                              activity={activity}
                              index={index}
                              onDeleteActivity={() =>
                                setActivityToDelete(activity)
                              }
                            />
                          </Wrapper>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </>
              ) : null}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {activityToDelete ? (
        <Modal
          onLeftClick={() => setActivityToDelete(null)}
          onRightClick={deleteActivity}
          title="Supprimer une activité"
          isSubmitting={false}
          leftLabel="Annuler"
          rightLabel="Confirmer"
        >
          Attention l'activité et les ressources qui lui sont associées seront
          définitivement supprimées.
        </Modal>
      ) : null}
    </>
  );
}
