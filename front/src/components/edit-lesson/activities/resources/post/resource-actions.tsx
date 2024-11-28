// Import des composants et icônes nécessaires
import { Loader } from "lucide-react"; // Icône de chargement
import Wrapper from "../../../../UI/wrapper/wrapper.component"; // Composant wrapper

// Type définissant les props du composant
type Props = {
  onCancel: (value: boolean) => void; // Fonction pour annuler l'action
  resetFilesList: () => void; // Fonction pour réinitialiser la liste des fichiers
  handleSubmit: () => void; // Fonction pour soumettre le formulaire
  filesNumber: number; // Nombre de fichiers sélectionnés
  isLoading: boolean; // État de chargement
  hasError: boolean; // Indicateur d'erreur
};

/**
 * Composant affichant les actions disponibles pour la gestion des ressources
 * Permet d'annuler, réinitialiser ou soumettre le formulaire d'upload
 *
 * @param onCancel - Fonction appelée pour annuler l'opération
 * @param resetFilesList - Fonction pour réinitialiser la liste des fichiers
 * @param handleSubmit - Fonction de soumission du formulaire
 * @param filesNumber - Nombre de fichiers sélectionnés
 * @param isLoading - État de chargement pendant l'upload
 * @param hasError - Indicateur d'erreur
 */
function ResourcesAction({
  onCancel,
  resetFilesList,
  handleSubmit,
  filesNumber,
  isLoading,
  cancelUpload,
  hasError,
}: Props & { cancelUpload: () => void }) {
  const handleCancel = () => {
    if (isLoading) {
      const confirmCancel = window.confirm(
        "Des téléversements de fichiers sont en cours, êtes-vous sûr de vouloir annuler ?"
      );
      if (confirmCancel) {
        cancelUpload();
      }
    } else {
      onCancel(false);
    }
  };

  return (
    // Wrapper principal pour contenir les boutons d'action
    <Wrapper>
      {/* Conteneur des boutons d'action avec flexbox pour l'alignement */}
      <div className="flex justify-between items-center">
        {/* Bouton d'annulation - Style outline */}
        <button className="btn btn-primary btn-outline" onClick={handleCancel}>
          Annuler
        </button>
        {/* Groupe de boutons alignés à droite */}
        <span className="flex justify-end items-center gap-x-4">
          {/* Bouton de réinitialisation - Style secondaire */}
          <button
            className="btn btn-secondary"
            onClick={resetFilesList}
            disabled={isLoading}
          >
            Réinitialiser
          </button>
          {/* Bouton de téléversement - Désactivé si aucun fichier ou si upload en cours */}
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={filesNumber === 0 || isLoading || hasError}
          >
            {/* Affichage conditionnel selon l'état de chargement */}
            {isLoading ? (
              // Affichage pendant le chargement avec icône animée
              <span className="flex items-center gap-x-2">
                <Loader className="animate-spin" /> <p>En cours...</p>
              </span>
            ) : (
              // Texte par défaut
              "Téléverser"
            )}
          </button>
        </span>
      </div>
    </Wrapper>
  );
}

// Export du composant pour utilisation dans d'autres fichiers
export default ResourcesAction;
