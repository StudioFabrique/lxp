import { useEffect, useRef, useState, useContext } from "react";
import { Plus } from "lucide-react";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Activity } from "../../../utils/interfaces/activity";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";
import Can from "../../UI/can/can.component";
import hasPermission from "../../../utils/hasPermission";
import { Context } from "../../../store/context.store";
import ActivityItem from "./activity-item";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

type ActivityListProps = {
  activities?: Activity[];
  selectedActivity?: Activity | null;
  newActivityButtonDisabled?: boolean;
  canEdit?: boolean;
  isLoading: boolean;
  onActivityReorder: (args: BaseEventPayload<ElementDragType>) => void;
  onSelectActivity: (activity: Activity) => void;
  onClickCreateActivity?: () => void;
};

export default function ActivityList({
  activities,
  selectedActivity,
  newActivityButtonDisabled,
  canEdit,
  isLoading,
  onActivityReorder,
  onSelectActivity,
  onClickCreateActivity,
}: ActivityListProps) {
  const { user } = useContext(Context);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const canUserEdit = !!(
    canEdit && hasPermission(user?.permissions || [], "update", "lesson")
  );

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;
        onActivityReorder({ source, location });
      },
    });
  }, [onActivityReorder]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      // canDrop doit retourner un boolean strict
      canDrop: () => canUserEdit,
      onDragEnter: () => setIsDraggingOver(true),
      onDragLeave: () => setIsDraggingOver(false),
      onDrop: () => setIsDraggingOver(false),
    });
  }, [canUserEdit]);

  return (
    <FadeWrapper>
      <div
        ref={containerRef}
        className={`pt-2 flex flex-col items-center gap-1 w-full select-none transition-all ${
          isDraggingOver ? "bg-base-200/50" : ""
        }`}
      >
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              index={index}
              isSelected={selectedActivity?.id === activity.id}
              canEdit={canUserEdit}
              onSelect={() => onSelectActivity(activity)}
            />
          ))
        ) : isLoading ? (
          <span className="animate-pulse text-info text-sm w-[90%]">
            Chargement des activités en cours...
          </span>
        ) : (
          <Can action="component" object="progression">
            <p className="text-primary text-sm">Aucune activité</p>
          </Can>
        )}

        {onClickCreateActivity && canEdit && !isDraggingOver && (
          <Can action="update" object="lesson">
            <span className="px-4 w-full">
              <button
                className="btn btn-outline btn-primary text-base-content hover:text-base-100 btn-sm h-fit text-[10px] w-full"
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
    </FadeWrapper>
  );
}
