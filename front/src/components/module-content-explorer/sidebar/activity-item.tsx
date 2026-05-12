import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useEffect, useRef, useState } from "react";
import activityIconType from "../../../utils/activity-icon-type";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";
import { ArrowDownUp } from "lucide-react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Activity } from "../../../utils/interfaces/activity";

type ActivityItemProps = {
  activity: Activity;
  index: number;
  isSelected: boolean;
  canEdit: boolean;
  onSelect: () => void;
};

export default function ActivityItem({
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
    if (!el || !canEdit) return;

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
  }, [index, activity.id, canEdit]);

  return (
    <button
      ref={ref}
      onClick={onSelect}
      className={`btn btn-ghost justify-start text-start btn-sm w-full h-6 transition-all ${
        isDragging ? "opacity-30" : "opacity-100"
      } ${isDraggedOver ? "border-t-2 border-primary" : "border-t-2 border-transparent"}`}
    >
      <span className="cursor-pointer">
        {activityIconType(activity.type, 4)}
      </span>
      <span
        className={`truncate w-[90%] cursor-pointer ${isSelected && "underline"}`}
      >
        {toUpperFirstLetter(activity.title)}
      </span>
      {canEdit && <ArrowDownUp className="w-4 hover:text-primary ml-auto" />}
    </button>
  );
}
