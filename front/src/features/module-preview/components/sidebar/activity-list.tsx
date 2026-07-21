import { useEffect, useRef, useState, useContext } from "react";
import { Plus } from "lucide-react";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Activity } from "../../../../../src/utils/interfaces/activity";
import FadeWrapper from "../../../../../src/components/wrappers/FadeWrapper";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { hasPermission } from "../../../../utils/helpers/rbac-helpers";
import { AuthContext } from "../../../../store/AuthProvider";
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
  const { user } = useContext(AuthContext);
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
        className={`flex flex-col items-center gap-1 w-full select-none px-4 transition-all ${
          isDraggingOver ? "bg-base-200/50" : ""
        }`}
      >
        <div className="mb-1 flex w-full items-center justify-between pb-1 mt-2">
          <span className="text-xs font-semibold text-base-content/60">
            Activités
          </span>
          {onClickCreateActivity && canEdit && !isDraggingOver && (
            <PermissionGuard action="update" object="lesson">
              <button
                className="btn btn-success btn-xs gap-1"
                disabled={newActivityButtonDisabled}
                onClick={onClickCreateActivity}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </PermissionGuard>
          )}
        </div>
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
          <p className="text-primary text-xs">Aucune activité</p>
        )}
      </div>
    </FadeWrapper>
  );
}
