// Import des composants et hooks nécessaires
import NewObjectiveButton from "./new-objective-button";
import NewObjectiveForm from "./new-objective-form";
import useNewObjective from "../../../hooks/use-new-objective";

// Props du composant
type Props = {
  onSubmit: (value: string) => void; // Fonction appelée lors de la soumission d'un nouvel objectif
  isLoading: boolean; // État de chargement
};

/**
 * Composant permettant de créer un nouvel objectif d'apprentissage
 * Affiche un bouton pour ouvrir le formulaire et le formulaire lui-même quand il est activé
 */
function CreateNewObjective(props: Props) {
  // Utilisation du hook personnalisé pour gérer la logique du formulaire
  const {
    toggleForm, // Contrôle l'affichage du formulaire
    newObjective, // Contient le texte du nouvel objectif
    handleSubmit, // Gère la soumission du formulaire
    handleCancel, // Gère l'annulation
    handleToggleForm, // Bascule l'affichage du formulaire
    setNewObjective, // Met à jour le texte de l'objectif
    formRef, // Référence vers le formulaire pour le scroll
  } = useNewObjective(props.onSubmit);

  return (
    <div className="flex flex-col gap-y-2 p-2">
      <div className="divider" />
      {/* Conteneur du bouton pour créer un nouvel objectif */}
      <div className="flex items-center gap-x-2 pl-2">
        <NewObjectiveButton
          toggleForm={toggleForm}
          setToggleForm={handleToggleForm}
        />
      </div>
      {/* Affiche le formulaire uniquement quand toggleForm est true */}
      {toggleForm ? (
        <NewObjectiveForm
          ref={formRef}
          newObjective={newObjective}
          setNewObjective={setNewObjective}
          onSubmit={handleSubmit}
          isLoading={props.isLoading}
          handleCancel={handleCancel}
        />
      ) : null}
    </div>
  );
}

export default CreateNewObjective;
