// Import des composants UI réutilisables
import React from "react";
import Field from "../../../UI/forms/field";

// Type définissant les props du composant
type props = {
  data: {
    values: Record<string, unknown>; // Valeurs du formulaire
    errors: { name: string[] }; // Erreurs de validation
    onChangeValue: (name: string, value: string) => void; // Fonction de mise à jour des valeurs
  };
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Gestion du changement de fichier
};

/**
 * Composant de formulaire pour l'ajout de ressources
 * @param data - Données du formulaire (valeurs, erreurs, fonction de modification)
 * @param onFileChange - Fonction appelée lors du changement de fichier
 */
function ResourceForm({ data, onFileChange }: props) {
  return (
    <span className="h-full flex flex-col gap-y-2">
      <h2 className="text-lg font-bold">Ressources</h2>
      {/* Conteneur du formulaire */}
      <form className="flex flex-col justify-around h-full gap-y-4">
        {/* Champ pour le nom de la ressource */}
        <span className="flex flex-col gap-y-4">
          <Field
            name="name"
            label="Nom du lien *"
            data={{
              values: { name: data.values.name },
              errors: [],
              onChangeValue: data.onChangeValue,
            }}
          />
        </span>
        {/* Input pour sélectionner le fichier - désactivé si aucun nom n'est saisi */}
        <input
          className="file-input file-input-bordered file-input-primary w-full max-w-md"
          type="file"
          onChange={onFileChange}
          disabled={
            !data.values.name || Object.keys(data.values.name).length === 0
          }
        />
      </form>
    </span>
  );
}

export default ResourceForm;
