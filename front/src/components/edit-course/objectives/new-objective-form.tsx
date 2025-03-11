import React, { useEffect } from "react";

// Props du composant formulaire
type Props = {
  newObjective: string; // Texte de l'objectif en cours d'édition
  setNewObjective: (value: string) => void; // Fonction pour mettre à jour le texte
  onSubmit: (event: React.FormEvent) => void; // Fonction appelée à la soumission
  isLoading: boolean; // État de chargement
  handleCancel: () => void; // Fonction pour annuler
};

/**
 * Composant formulaire pour créer un nouvel objectif d'apprentissage
 * Utilise forwardRef pour permettre le scroll automatique
 */
const NewObjectiveForm = React.forwardRef<HTMLFormElement, Props>(
  (props, ref) => {
    // Effet pour scroller vers le formulaire quand il est affiché
    useEffect(() => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [ref]);

    return (
      <form
        className="flex flex-col gap-y-2"
        onSubmit={props.onSubmit}
        ref={ref}
      >
        {/* Champ de saisie pour le nom de l'objectif */}
        <div className="flex flex-col gap-y-2">
          <label htmlFor="objective-name">Description de l'objectif</label>
          <input
            className="input focus:outline-none input-bordered input-primary"
            type="text"
            id="objective-name"
            name="objective-name"
            placeholder="Entrez un nouvel objectif"
            value={props.newObjective}
            onChange={(event) => props.setNewObjective(event.target.value)}
          />
        </div>
        {/* Boutons d'action */}
        <span className="flex justify-between gap-x-2 mt-4">
          <button
            className="btn btn-primary btn-outline"
            onClick={props.handleCancel}
          >
            Annuler
          </button>
          <button className="btn btn-primary" disabled={props.isLoading}>
            {props.isLoading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Créer l'objectif"
            )}
          </button>
        </span>
      </form>
    );
  }
);

export default NewObjectiveForm;
