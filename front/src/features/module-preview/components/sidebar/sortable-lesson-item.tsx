import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/utils/set-custom-native-drag-preview";
import { type PropsWithChildren, useEffect, useRef, useState } from "react";
import { cn } from "../../../../utils/cn";

type Props = PropsWithChildren<{
  courseId: number;
  lessonId: number;
  lessonTitle: string;
  enabled: boolean;
}>;

export default function SortableLessonItem({ courseId, lessonId, lessonTitle, enabled, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "lesson", courseId, id: lessonId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: () => ({ x: 20, y: 20 }),
            render: ({ container }) => {
              const preview = document.createElement("div");
              preview.textContent = lessonTitle;
              preview.className = "max-w-72 truncate rounded-xl bg-primary px-4 py-2 text-sm text-primary-content shadow-lg";
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
        canDrop: ({ source }) => source.data.type === "lesson" && source.data.courseId === courseId,
        getData: () => ({ type: "lesson", courseId, id: lessonId }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
      }),
    );
  }, [courseId, lessonId, lessonTitle, enabled]);

  return (
    <div ref={ref} className={cn("relative w-full rounded-xl", {
      "cursor-grab active:cursor-grabbing": enabled,
      "opacity-40": isDragging,
    })}>
      {isDraggedOver && <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-2 z-10 h-1 rounded-full bg-primary" />}
      <div inert={enabled} className={enabled ? "pointer-events-none" : undefined}>{children}</div>
    </div>
  );
}
