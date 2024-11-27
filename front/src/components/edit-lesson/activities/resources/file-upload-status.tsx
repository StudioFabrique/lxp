// Import des icônes nécessaires
import { CheckCircle, Loader2 } from "lucide-react";

/**
 * Interface définissant les props du composant FileUploadStatus
 */
type Props = {
  minUpload: number; // Pourcentage minimum de progression pour ce fichier
  maxUpload: number; // Pourcentage maximum de progression pour ce fichier
  uploadProgess: number; // Progression actuelle de l'upload
  totalFiles: number; // Nombre total de fichiers à uploader
};

/**
 * Composant FileUploadStatus
 * Affiche l'état d'avancement de l'upload d'un fichier sous forme d'indicateur visuel
 */
const FileUploadStatus = ({ minUpload, maxUpload, uploadProgess }: Props) => {
  /**
   * Calcule le pourcentage de progression pour l'indicateur circulaire
   * @returns Le pourcentage de progression normalisé entre 0 et 100
   */
  const calculateProgress = () => {
    // Si la progression est inférieure au minimum, on retourne 0
    if (uploadProgess <= minUpload) return 0;
    // Si la progression dépasse le maximum, on retourne 100
    if (uploadProgess >= maxUpload) return 100;

    // Calcul du pourcentage relatif dans la plage du fichier actuel
    const range = maxUpload - minUpload;
    const currentProgress = uploadProgess - minUpload;
    return (currentProgress / range) * 100;
  };

  return (
    <div>
      {/* Affichage conditionnel selon l'état de progression */}
      {uploadProgess >= minUpload && uploadProgess <= maxUpload ? (
        // Indicateur circulaire de progression pendant l'upload
        <div
          className="radial-progress text-success"
          style={
            {
              "--value": calculateProgress(),
              "--size": "1.5rem",
              "--thickness": "3px",
            } as React.CSSProperties
          }
          role="progressbar"
        ></div>
      ) : uploadProgess >= maxUpload ? (
        // Icône de succès quand l'upload est terminé
        <CheckCircle className="text-success" />
      ) : (
        // Icône de chargement en rotation avant le début de l'upload
        <Loader2 className="animate-spin text-info" />
      )}
    </div>
  );
};

export default FileUploadStatus;
