// Import des types et composants nécessaires
import { ReactNode, useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { cn } from "../../utils/cn";

interface SortableItemProps {
  contextId: string;
  index: number;
  disabled: boolean;
  children: ReactNode;
}

export function SortableItem({
  contextId,
  index,
  disabled,
  children,
}: SortableItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ contextId, index }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        getData: () => ({ contextId, index }),
        canDrop: ({ source }) => source.data.contextId === contextId,
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
      }),
    );
  }, [contextId, disabled, index]);

  return (
    <div
      ref={ref}
      className={cn(isDragging ? "opacity-30" : "opacity-100", isDraggedOver ? "border-t-2 border-primary" : "border-t-2 border-transparent")}
    >
      {children}
    </div>
  );
}
