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
} from "@hello-pangea/dnd";
import ActivityListItem from "./activity-list-item";
import type { Activity } from "../../../../../../src/utils/interfaces/activity";
import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import Modal from "../../../../../../src.legacy/components/UI/modal/modal";

type Props = {
  activities: Activity[];
  setActivities: Dispatch<SetStateAction<Activity[]>>;
  onDeleteActivity: (activityId: number) => void;
  onReorderActivities: (activitiesIds: number[]) => void;
};

export default function DNDAcitivities(props: Props) {
  const [submit, setSubmit] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null,
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
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...(provided.draggableProps as any)}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          {...(provided.dragHandleProps as any)}
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
