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
import Activity from "../../utils/interfaces/activity";
import Wrapper from "../UI/wrapper/wrapper.component";
import ActivityListItem from "./activity-list-item";

type Props = {
  activities: Activity[];
  setActivities: Dispatch<SetStateAction<Activity[]>>;
  onDeleteActivity: (activityId: number) => void;
  onReorderActivities: (activitiesIds: number[]) => void;
};

export default function DNDAcitivities(props: Props) {
  const [submit, setSubmit] = useState(false);

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
                            onDeleteActivity={props.onDeleteActivity}
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
  );
}
