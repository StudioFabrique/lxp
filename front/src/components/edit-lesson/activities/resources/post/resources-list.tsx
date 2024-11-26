// Import des hooks et composants nécessaires
import { useDragAndDrop } from "../../../../../hooks/useDragAndDrop"; // Hook personnalisé pour gérer le drag & drop
import { DndWrapper } from "../../../../UI/DndWrapper"; // Composant wrapper pour le drag & drop
import ResourceItem from "./resource-item"; // Composant qui affiche un élément de ressource
import { useEffect } from "react";

// Type définissant les props du composant
type Props = {
  filesList: { name: string; file: File; hasError: boolean }[]; // Liste des fichiers avec leurs propriétés
  handleRemoveResource: (index: number) => void; // Fonction pour supprimer une ressource
  isLoading: boolean; // État de chargement
  onReorder: (
    newList: { name: string; file: File; hasError: boolean }[]
  ) => void; // Fonction pour mettre à jour l'ordre
  uploadProgress: number | null; // Progression de l'upload
};

/**
 * Composant ResourcesList
 * Affiche une liste de ressources avec fonctionnalité de drag & drop
 * Permet de visualiser, réorganiser et supprimer les fichiers avant leur téléversement
 */
function ResourcesList({
  filesList,
  handleRemoveResource,
  isLoading,
  onReorder,
  uploadProgress,
}: Props) {
  // Utilisation du hook useDragAndDrop pour gérer le drag & drop
  const { handleDragEnd } = useDragAndDrop({
    items: filesList, // Liste des éléments à réordonner
    onReorder, // Callback appelé après réordonnancement
  });

  useEffect(() => {
    if (uploadProgress && uploadProgress > 0) {
      console.log("Upload progress:", uploadProgress);
    }
  }, [uploadProgress]);

  return (
    <>
      {uploadProgress && uploadProgress > 0 ? (
        <div className="mb-4 w-full">
          <p className="w-full text-xs text-info flex justify-end">
            {uploadProgress} %
          </p>
          <progress
            className="progress progress-secondary w-full"
            value={uploadProgress}
            max="100"
          ></progress>
        </div>
      ) : null}
      <DndWrapper
        droppableId="resources" // ID unique pour la zone de drop
        items={filesList} // Liste des éléments à afficher
        onDragEnd={handleDragEnd} // Callback appelé quand un drag se termine
        renderItem={(resource, index) => (
          // Rendu de chaque élément de la liste
          <ResourceItem
            resource={resource} // Données de la ressource
            index={index} // Position dans la liste
            isLoading={isLoading} // État de chargement
            onRemove={handleRemoveResource} // Callback de suppression
          />
        )}
      />
    </>
  );
}

export default ResourcesList;
