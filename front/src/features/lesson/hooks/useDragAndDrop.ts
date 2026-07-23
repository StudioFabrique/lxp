import { useState, useCallback } from "react";

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
    (sourceIndex: number, destinationIndex: number) => {
      const newItems = Array.from(items);
      const [movedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(destinationIndex, 0, movedItem);

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
