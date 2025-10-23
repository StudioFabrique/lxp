import { ArrowDownUp, Plus } from "lucide-react";
import activityIconType from "../../../utils/activity-icon-type";
import { Activity } from "../../../utils/interfaces/activity";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";
import Can from "../../UI/can/can.component";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import hasPermission from "../../../utils/hasPermission";
import { useContext } from "react";
import { Context } from "../../../store/context.store";

type ActivityListProps = {
  activities?: Activity[];
  selectedActivity?: Activity | null;
  newActivityButtonDisabled?: boolean;
  onActivityOrderChange: OnDragEndResponder;
  onSelectActivity: (activity: Activity) => void;
  onClickCreateActivity?: () => void;
};

export default function ActivityList({
  activities,
  selectedActivity,
  newActivityButtonDisabled,
  onActivityOrderChange,
  onSelectActivity,
  onClickCreateActivity,
}: ActivityListProps) {
  const { user } = useContext(Context);

  return (
    <FadeWrapper>
      <DragDropContext onDragEnd={onActivityOrderChange}>
        <Droppable
          droppableId="droppable"
          isDropDisabled={
            !hasPermission(user?.permissions || [], "update", "lesson")
          }
        >
          {(provided, droppableState) => (
            <div
              ref={provided.innerRef}
              className={`pt-2 flex flex-col items-center gap-1 w-full ${
                droppableState.isDraggingOver && "-mt-5 mb-5"
              }`}
              {...provided.droppableProps}
            >
              {provided.placeholder}
              {activities ? (
                activities?.map((activity, index) => (
                  <Draggable
                    key={activity.id}
                    draggableId={activity.id.toString()}
                    index={index}
                    isDragDisabled={
                      !hasPermission(
                        user?.permissions || [],
                        "update",
                        "lesson"
                      )
                    }
                  >
                    {(provided) => (
                      <button
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={activity.id}
                        onClick={() => onSelectActivity(activity)}
                        className="btn btn-ghost justify-start text-start btn-sm w-full h-6"
                      >
                        <span className="cursor-pointer">
                          {activityIconType(activity.type, 4)}
                        </span>
                        <span
                          className={`truncate w-[90%] cursor-pointer ${
                            selectedActivity?.id === activity.id && "underline"
                          }`}
                        >
                          {activity.title}
                        </span>
                        <Can action="update" object="lesson">
                          <ArrowDownUp className="w-4 hover:text-primary" />
                        </Can>
                      </button>
                    )}
                  </Draggable>
                ))
              ) : (
                <Can action="component" object="progression">
                  <p className="text-primary text-sm">Aucune activité</p>
                </Can>
              )}
              {onClickCreateActivity && !droppableState.isDraggingOver && (
                <Can action="update" object="lesson">
                  <span className="px-4 w-full">
                    <button
                      className="btn btn-outline btn-secondary hover:text-base-100 btn-sm h-fit text-[10px] mt-2 w-full"
                      disabled={newActivityButtonDisabled}
                      onClick={onClickCreateActivity}
                    >
                      <Plus className="w-4 h-6" />
                      Ajouter une activité
                    </button>
                  </span>
                </Can>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </FadeWrapper>
  );
}
