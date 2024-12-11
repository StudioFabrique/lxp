// Import des icônes nécessaires de Lucide React
import { FileText } from "lucide-react";
import { GripVertical, Trash2 } from "lucide-react";
// Import du composant wrapper personnalisé
import SubWrapper from "../../../UI/sub-wrapper/sub-wrapper.component";
// Import de l'utilitaire de conversion de taille de fichier
import { displaySize } from "../../../../helpers/sizeUnitConversion";
import { UploadProgressValues } from "./resources-list";
import FileUploadStatus from "./file-upload-status";

/**
 * Type définissant les props du composant ResourceItem
 */
type Props = {
  resource: { name: string; file: File; hasError: boolean }; // Données de la ressource
  index: number; // Position dans la liste
  isLoading: boolean; // État de chargement
  onRemove: (index: number) => void; // Callback de suppression
  uploadProgressValues: UploadProgressValues;
  uploadProgress: number | null;
  totalFiles: number;
};

/**
 * Composant ResourceItem
 * Affiche une ressource individuelle dans la liste avec ses informations
 * Permet de la déplacer (drag & drop) et de la supprimer
 */
function ResourceItem({
  resource,
  index,
  isLoading,
  onRemove,
  uploadProgressValues,
  uploadProgress,
  totalFiles,
}: Props) {
  return (
    // Wrapper qui gère l'affichage des erreurs
    <SubWrapper hasError={resource.hasError}>
      <div className="w-full flex justify-between items-center text-xs">
        <span className="w-full flex items-center">
          {/* Zone de drag & drop et icône de statut */}
          <div className="w-1/6 flex gap-x-2 items-center">
            {/* Poignée pour le drag & drop */}
            <GripVertical
              className={`${isLoading ? "text-primary/50" : "20"}`}
            />
            {/* Affiche soit l'icône de chargement soit l'icône de fichier */}
            {isLoading ? (
              <FileUploadStatus
                {...uploadProgressValues}
                uploadProgess={uploadProgress ?? 0}
                totalFiles={totalFiles}
              />
            ) : (
              <FileText className="text-info" />
            )}
          </div>
          {/* Affichage du nom personnalisé de la ressource */}
          <p className="w-2/6 truncate">{resource.name}</p>
          {/* Affichage du nom original du fichier */}
          <p className="w-2/6 truncate">{resource.file.name}</p>
          {/* Affichage de la taille du fichier convertie en unité lisible */}
          <p className="w-1/6 truncate">{displaySize(resource.file.size)}</p>
        </span>
        {/* Bouton permettant de supprimer la ressource */}
        <button onClick={() => onRemove(index)} disabled={isLoading}>
          <Trash2 className="w-4 h-4 text-error cursor-pointer" />
        </button>
      </div>
    </SubWrapper>
  );
}

export default ResourceItem;
