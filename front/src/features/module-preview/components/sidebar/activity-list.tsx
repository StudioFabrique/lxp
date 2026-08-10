import { useEffect, useRef, useState, useContext } from "react";
import { Plus } from "lucide-react";
import {
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Activity } from "../../../../../src/utils/interfaces/activity";
import FadeWrapper from "../../../../../src/components/wrappers/FadeWrapper";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { AbilityContext } from "../../../../rbac/AbilityProvider";
import ActivityItem from "./activity-item";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { cn } from "../../../../utils/cn";
import { emitOnboardingEvent } from "../../../onboarding/onboarding-events";

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
  const ability = useContext(AbilityContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const canUserEdit = Boolean(canEdit && ability.can("update", "lesson"));

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
        className={cn(
          "flex items-center gap-1 w-full select-none px-4 transition-all mt-2",
          isDraggingOver ? "bg-base-200/50" : "",
          activities && activities.length === 0 ? "flex-row" : "flex-col",
        )}
      >
        <div className="mb-1 flex w-full items-center justify-between pb-1 mt-2 text-xs font-semibold text-base-content/60">
          {activities && activities.length > 0 ? (
            <div className=" flex items-center gap-0.5">
              <span>Activités</span>
              <span>
                {(activities?.length || 0) > 1
                  ? `(${activities?.length})`
                  : null}
              </span>
            </div>
          ) : (
            <p>Aucune activité</p>
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
        ) : null}
        {onClickCreateActivity && canEdit && !isDraggingOver && (
          <PermissionGuard action="update" object="lesson">
            <button
              data-onboarding="activity-create"
              className={cn(
                "btn btn-success opacity-70 btn-xs gap-1",
                activities && activities.length === 0 ? "mt-0" : "mt-2",
              )}
              disabled={newActivityButtonDisabled}
              onClick={() => {
                emitOnboardingEvent({ type: "activity_creation_started" });
                onClickCreateActivity();
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Ajouter une activité
            </button>
          </PermissionGuard>
        )}
      </div>
    </FadeWrapper>
  );
}
