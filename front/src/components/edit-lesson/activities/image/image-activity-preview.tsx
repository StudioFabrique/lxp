// Import des dépendances nécessaires
import { ACTIVITIES } from "../../../../config/urls";
import Activity from "../../../../utils/interfaces/activity";
import ImageActivityEditor from "./image-activity-editor";

// Définition des props du composant
type Props = {
  activity: Activity; // L'activité à afficher/éditer
  isEditing: boolean; // État d'édition du composant
  onSubmitted: (value: boolean) => void; // Callback appelé après soumission
};

/**
 * Composant qui affiche une prévisualisation d'une activité de type image
 * Si isEditing est true, affiche l'éditeur d'image
 * Sinon affiche l'image elle-même
 */
export default function ImageActivityPreview({
  activity,
  isEditing,
  onSubmitted,
}: Props) {
  return (
    <>
      {isEditing ? (
        // Mode édition: affiche l'éditeur d'image
        <ImageActivityEditor activity={activity} onCancel={onSubmitted} />
      ) : (
        // Mode affichage: affiche l'image depuis le serveur
        <img src={`${ACTIVITIES}images/${activity.url}`} />
      )}
    </>
  );
}
