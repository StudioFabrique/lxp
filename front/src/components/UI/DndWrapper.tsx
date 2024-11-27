// Import des types et composants nécessaires
import { ReactNode } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DndHandlers } from "../../utils/interfaces/dnd";

/**
 * Interface définissant les props du composant DndWrapper
 * @template T - Type générique des éléments de la liste
 */
interface DndWrapperProps<T> extends DndHandlers {
  droppableId: string; // ID unique de la zone de drop
  items: T[]; // Liste des éléments à rendre draggable
  renderItem: (item: T, index: number) => ReactNode; // Fonction de rendu pour chaque élément
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
}: DndWrapperProps<T>) {
  return (
    // Contexte global du drag & drop
    <DragDropContext onDragEnd={onDragEnd}>
      {/* Zone où les éléments peuvent être déposés */}
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            className="flex flex-col gap-y-2"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* Mapping sur chaque élément pour le rendre draggable */}
            {items.map((item, index) => (
              <Draggable
                key={index}
                draggableId={index.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderItem(item, index)}
                  </div>
                )}
              </Draggable>
            ))}
            {/* Placeholder nécessaire pour maintenir l'espace pendant le drag */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
