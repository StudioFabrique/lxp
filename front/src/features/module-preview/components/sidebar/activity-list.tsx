import { useEffect, useState, useContext } from "react";
import { ArrowDownUp, Plus } from "lucide-react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
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
  readOnly?: boolean;
  activities?: Activity[];
  lessonId?: number;
  selectedActivity?: Activity | null;
  newActivityButtonDisabled?: boolean;
  canEdit?: boolean;
  isLoading: boolean;
  onActivityReorder?: (args: BaseEventPayload<ElementDragType>) => void;
  onSelectActivity?: (activity: Activity) => void;
  onClickCreateActivity?: () => void;
  isReorderingActivities?: boolean;
  onReorderingActivitiesChange?: (isReordering: boolean) => void;
};

export default function ActivityList({
  readOnly = false,
  activities,
  lessonId,
  selectedActivity,
  newActivityButtonDisabled,
  canEdit,
  isLoading,
  onActivityReorder,
  onSelectActivity,
  onClickCreateActivity,
  isReorderingActivities,
  onReorderingActivitiesChange,
}: ActivityListProps) {
  const ability = useContext(AbilityContext);
  const [localIsReordering, setLocalIsReordering] = useState(false);
  const isReordering = isReorderingActivities ?? localIsReordering;

  const canUserEdit = Boolean(!readOnly && canEdit && ability.can("update", "lesson"));

  useEffect(() => {
    if (!isReordering || !canUserEdit || !onActivityReorder) return;
    return monitorForElements({
      canMonitor: ({ source }) => source.data.type === "activity" && source.data.lessonId === lessonId,
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (destination?.data.type !== "activity" || destination.data.lessonId !== lessonId) return;
        onActivityReorder({ source, location });
      },
    });
  }, [canUserEdit, isReordering, lessonId, onActivityReorder]);

  return (
    <FadeWrapper>
      <div
        className={cn(
          "flex items-center gap-1 w-full select-none px-4 transition-all mt-2",
          activities && activities.length === 0 ? "flex-row" : "flex-col",
        )}
      >
        <div className="mb-1 flex w-full items-center justify-between pb-1 mt-2 text-xs font-semibold text-base-content/60">
          {isLoading ? (
            <div className="skeleton h-4 w-24" aria-hidden="true" />
          ) : activities && activities.length > 0 ? (
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
          {canUserEdit && (activities?.length ?? 0) > 1 && (
            <button
              type="button"
              className={cn("btn btn-xs tooltip", isReordering ? "btn-primary" : "btn-ghost text-base-content")}
              data-tip={isReordering ? "Terminer" : "Réorganiser les activités"}
              aria-label={isReordering ? "Terminer la réorganisation des activités" : "Réorganiser les activités"}
              aria-pressed={isReordering}
              onClick={() => {
                if (onReorderingActivitiesChange) {
                  onReorderingActivitiesChange(!isReordering);
                } else {
                  setLocalIsReordering((current) => !current);
                }
              }}
            >
              <ArrowDownUp className="size-4" />
            </button>
          )}
        </div>
        {isLoading ? (
          <div role="status" aria-label="Chargement des activités" className="w-full space-y-2">
            <span className="sr-only">Chargement des activités…</span>
            {[0, 1, 2].map((item) => <div key={item} className="skeleton h-8 w-full" aria-hidden="true" />)}
          </div>
        ) : activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              disabled={readOnly}
              activity={activity}
              index={index}
              lessonId={lessonId}
              isSelected={selectedActivity?.id === activity.id}
              canEdit={canUserEdit}
              isReordering={isReordering}
              onSelect={() => onSelectActivity?.(activity)}
            />
          ))
        ) : null}
        {!readOnly && onClickCreateActivity && canEdit && !isReordering && (
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
