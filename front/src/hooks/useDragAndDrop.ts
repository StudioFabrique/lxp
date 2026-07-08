import { useState, useCallback } from "react";
import type { DropResult } from "@hello-pangea/dnd";

interface UseDragAndDropProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
}

export function useDragAndDrop<T>({
  items,
  onReorder,
}: UseDragAndDropProps<T>) {
  const [submit, setSubmit] = useState(false);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const newItems = Array.from(items);
      const [movedItem] = newItems.splice(result.source.index, 1);
      newItems.splice(result.destination.index, 0, movedItem);

      onReorder(newItems);
      setSubmit(true);
    },
    [items, onReorder],
  );

  return {
    submit,
    setSubmit,
    handleDragEnd,
  };
}
