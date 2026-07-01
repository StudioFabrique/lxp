// Import des hooks et composants nécessaires
import { useDragAndDrop } from "../../../../hooks/useDragAndDrop"; // Hook personnalisé pour gérer le drag & drop
import { DndWrapper } from "../../../UI/DndWrapper"; // Composant wrapper pour le drag & drop
import ResourceItem from "./resource-item"; // Composant qui affiche un élément de ressource
import { useMemo } from "react";

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

// Type pour stocker les valeurs de progression d'upload pour chaque fichier
export type UploadProgressValues = {
  minUpload: number; // Pourcentage minimum d'upload atteint
  maxUpload: number; // Pourcentage maximum d'upload possible
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

  // Calcul de la taille totale des fichiers à uploader
  const totalFilesSize = useMemo(() => {
    return filesList.reduce((acc, file) => acc + file.file.size, 0);
  }, [filesList]);

  // Calcul des valeurs de progression pour chaque fichier
  const uploadProgressValues = useMemo(() => {
    // Si pas de fichiers ou taille totale nulle, retourne un tableau vide
    if (!filesList.length || !totalFilesSize) return [];

    // Pour chaque fichier, calcule les pourcentages min et max d'upload
    return filesList.reduce((acc: UploadProgressValues[], file, index) => {
      // Calcul de la taille totale des fichiers précédents
      const previousFilesSize = filesList
        .slice(0, index)
        .reduce((sum, f) => sum + f.file.size, 0);

      // Calcul des pourcentages
      const minUpload = (previousFilesSize / totalFilesSize) * 100;
      const maxUpload =
        ((previousFilesSize + file.file.size) / totalFilesSize) * 100;

      return [...acc, { minUpload, maxUpload }];
    }, []);
  }, [filesList, totalFilesSize]);

  return (
    <div className="flex flex-col gap-y-2">
      {/* Affichage de la barre de progression globale si un upload est en cours */}
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
      {/* Composant de drag & drop qui contient la liste des ressources */}
      <DndWrapper
        isLoading={isLoading}
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
            uploadProgressValues={uploadProgressValues[index]} // Valeurs de progression pour ce fichier
            uploadProgress={uploadProgress} // Progression globale de l'upload
            totalFiles={filesList.length} // Nombre total de fichiers
          />
        )}
      />
    </div>
  );
}

export default ResourcesList;
