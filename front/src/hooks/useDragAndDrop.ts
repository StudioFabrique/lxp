import { useState, useCallback } from "react";
import { DropResult } from "@hello-pangea/dnd";

/**
 * Interface définissant les props du hook useDragAndDrop
 * @template T - Type générique des éléments de la liste
 */
interface UseDragAndDropProps<T> {
  items: T[]; // Liste des éléments à réordonner
  onReorder: (items: T[]) => void; // Callback appelé après réordonnancement
}

/**
 * Hook personnalisé pour gérer le drag & drop
 * Permet de réordonner une liste d'éléments via drag & drop
 * @template T - Type générique des éléments de la liste
 */
export function useDragAndDrop<T>({
  items,
  onReorder,
}: UseDragAndDropProps<T>) {
  // État pour suivre si un réordonnancement a été effectué
  const [submit, setSubmit] = useState(false);

  /**
   * Gère la fin d'un drag & drop
   * Réordonne la liste et met à jour l'état
   */
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      // Si pas de destination, on ne fait rien
      if (!result.destination) return;

      // Crée une nouvelle copie de la liste
      const newItems = Array.from(items);
      // Retire l'élément de sa position source
      const [movedItem] = newItems.splice(result.source.index, 1);
      // Insère l'élément à sa position de destination
      newItems.splice(result.destination.index, 0, movedItem);

      // Met à jour la liste via le callback
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
