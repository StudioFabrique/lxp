import {
  DraggableProvided,
  DroppableProvided,
  DropResult,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";

export interface DndProps {
  provided: DraggableProvided | DroppableProvided;
  snapshot?: DraggableStateSnapshot;
}

export interface DndHandlers {
  onDragEnd: (result: DropResult) => void;
}
