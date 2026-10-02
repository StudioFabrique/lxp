// Import des types et composants nécessaires
import { ReactNode, useEffect, useId } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DndHandlers } from "../../utils/interfaces/dnd";
import { SortableItem } from "./SortableItem";

/**
 * Interface définissant les props du composant DndWrapper
 * @template T - Type générique des éléments de la liste
 */
interface DndWrapperProps<T> extends DndHandlers {
  droppableId: string; // ID unique de la zone de drop
  items: T[]; // Liste des éléments à rendre draggable
  isLoading: boolean;
  renderItem: (item: T, index: number) => ReactNode; // Fonction de rendu pour chaque élément
  getItemId?: (item: T, index: number) => string | number;
}

/**
 * Composant DndWrapper
 * Wrapper qui implémente la fonctionnalité de drag & drop
 * @template T - Type générique des éléments de la liste
 */
export function DndWrapper<T>({
  droppableId,
  items,
  onDragEnd,
  renderItem,
  isLoading,
  getItemId,
}: DndWrapperProps<T>) {
  const generatedId = useId();
  const contextId = `${droppableId}-${generatedId}`;

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.contextId === contextId,
      onDrop: ({ source, location }) => {
        const target = location.current.dropTargets[0];
        if (!target || target.data.contextId !== contextId) return;

        const sourceIndex = source.data.index;
        const destinationIndex = target.data.index;
        if (
          typeof sourceIndex !== "number" ||
          typeof destinationIndex !== "number"
        )
          return;
        if (sourceIndex !== destinationIndex) onDragEnd(sourceIndex, destinationIndex);
      },
    });
  }, [contextId, onDragEnd]);

  return (
    <div className="flex flex-col gap-y-2">
      {items.map((item, index) => (
        <SortableItem
          contextId={contextId}
          disabled={isLoading}
          index={index}
          key={getItemId?.(item, index) ?? index}
        >
          {renderItem(item, index)}
        </SortableItem>
      ))}
    </div>
  );
}
