import SubmitButton from "../../components/UI/submit-button";

// Props du composant avec leurs types
type Props = {
  isLoading: boolean; // État de chargement pour le bouton de soumission
  handleResetForm: () => void; // Fonction pour réinitialiser le formulaire
  handleStep: (value: boolean) => void; // Fonction pour naviguer entre les étapes
};

/**
 * Composant affichant les boutons d'action pour le formulaire de nouvelle leçon
 * Permet de réinitialiser le formulaire, revenir en arrière ou soumettre
 */
export default function NewLessonActions(props: Props) {
  return (
    // Container principal avec flex pour aligner les boutons
    <div className="flex justify-between items-center">
      {/* Bouton de réinitialisation du formulaire */}
      <button
        className="btn btn-primary btn-outline"
        type="button"
        onClick={props.handleResetForm}
      >
        Réinitialiser
      </button>
      {/* Groupe de boutons alignés à droite */}
      <span className="flex gap-x-4 justify-end">
        {/* Bouton retour vers l'étape précédente */}
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => props.handleStep(false)}
        >
          Retour
        </button>
        {/* Bouton de soumission avec état de chargement */}
        <SubmitButton
          label="Enregistrer"
          loadingLabel="Enregistrement..."
          isLoading={props.isLoading}
        />
      </span>
    </div>
  );
}
