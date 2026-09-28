import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useEffect, useRef, useState } from "react";
import activityIconType from "../../../../utils/helpers/activity-icon-type";
import { GripVertical } from "lucide-react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Activity } from "../../../../../src/utils/interfaces/activity";
import { cn } from "../../../../utils/cn";

type ActivityItemProps = {
  disabled?: boolean;
  activity: Activity;
  index: number;
  lessonId?: number;
  isSelected: boolean;
  canEdit: boolean;
  isReordering?: boolean;
  onSelect: () => void;
};

export default function ActivityItem({
  disabled = false,
  activity,
  index,
  lessonId,
  isSelected,
  canEdit,
  isReordering = false,
  onSelect,
}: ActivityItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canEdit || disabled || !isReordering) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: "activity", lessonId, index, id: activity.id }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) => source.data.type === "activity" && source.data.lessonId === lessonId,
        getData: () => ({ type: "activity", lessonId, index, id: activity.id }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
      }),
    );
  }, [index, activity.id, canEdit, disabled, isReordering, lessonId]);

  return (
    <button
      ref={ref}
      onClick={disabled || isReordering ? undefined : onSelect}
      disabled={disabled}
      className={cn(
        "btn btn-ghost justify-start text-start btn-sm w-full h-6 transition-all opacity-100 border-t-2 border-transparent",
        {
          "opacity-30": isDragging,
          "border-t-2 border-primary": isDraggedOver,
          "hover:bg-transparent cursor-default": disabled,
          "cursor-grab active:cursor-grabbing": isReordering,
        },
      )}
    >
      {activityIconType(activity.type, 4)}
      <span
        className={cn("truncate w-[90%] first-letter:uppercase", isSelected && "underline")}
      >
        {formatTitle(activity.title)}
      </span>
      {isReordering && (
        <GripVertical aria-hidden="true" className="w-4 ml-auto shrink-0" />
      )}
    </button>
  );
}
