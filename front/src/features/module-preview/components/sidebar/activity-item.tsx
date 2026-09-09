import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useEffect, useRef, useState } from "react";
import activityIconType from "../../../../utils/helpers/activity-icon-type";
import { ArrowDownUp } from "lucide-react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Activity } from "../../../../../src/utils/interfaces/activity";
import { cn } from "../../../../utils/cn";

type ActivityItemProps = {
  disabled?: boolean;
  activity: Activity;
  index: number;
  isSelected: boolean;
  canEdit: boolean;
  onSelect: () => void;
};

export default function ActivityItem({
  disabled = false,
  activity,
  index,
  isSelected,
  canEdit,
  onSelect,
}: ActivityItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canEdit || disabled) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ index, id: activity.id }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: el,
        getData: () => ({ index }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
      }),
    );
  }, [index, activity.id, canEdit, disabled]);

  return (
    <button
      ref={ref}
      onClick={onSelect}
      className={cn(
        "btn btn-ghost justify-start text-start btn-sm w-full h-6 transition-all opacity-100 border-t-2 border-transparent",
        {
          "opacity-30": isDragging,
          "border-t-2 border-primary": isDraggedOver,
          "hover:bg-transparent cursor-default": disabled,
        },
      )}
    >
      {activityIconType(activity.type, 4)}
      <span
        className={`truncate w-[90%] first-letter:uppercase ${isSelected && "underline"}`}
      >
        {activity.title}
      </span>
      {canEdit && !disabled && (
        <ArrowDownUp className="w-4 hover:text-primary ml-auto" />
      )}
    </button>
  );
}
