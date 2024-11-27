import {
  DraggableProvided,
  DroppableProvided,
  DropResult,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

export interface DndProps {
  provided: DraggableProvided | DroppableProvided;
  snapshot?: DraggableStateSnapshot;
}

export interface DndHandlers {
  onDragEnd: (result: DropResult) => void;
}
