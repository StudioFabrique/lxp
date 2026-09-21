import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { GripVertical } from "lucide-react";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import { cn } from "../../../../utils/cn";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/utils/set-custom-native-drag-preview";

type Props = PropsWithChildren<{
  courseId: number;
  courseTitle: string;
  index: number;
  enabled: boolean;
}>;

export default function SortableCourseItem({
  courseId,
  courseTitle,
  index,
  enabled,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "course", id: courseId, index }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: () => ({ x: 20, y: 20 }),
            render: ({ container }) => {
              const preview = document.createElement("div");
              preview.textContent = courseTitle;
              preview.className =
                "max-w-72 truncate rounded-lg border border-primary/30 bg-base-100 px-4 py-3 font-semibold text-base-content shadow-xl";
              container.append(preview);
              return () => preview.remove();
            },
          });
        },
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => source.data.type === "course",
        getData: () => ({ type: "course", index }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
      }),
    );
  }, [courseId, courseTitle, enabled, index]);

  return (
    <div
      ref={ref}
      className={cn("relative w-full rounded-lg transition-all", {
        "cursor-grab ring-1 ring-base-300 hover:ring-primary active:cursor-grabbing": enabled,
        "opacity-40": isDragging,
        "-translate-y-0.5 border-t-4 border-primary": isDraggedOver,
      })}
    >
      {enabled && (
        <div className="pointer-events-none absolute right-3 top-1/2 z-30 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-content shadow">
          <GripVertical className="size-4" />
        </div>
      )}
      {children}
    </div>
  );
}
