// Import des dépendances nécessaires
import { useEffect } from "react";
import { Resource } from "../../../../../utils/interfaces/activity";
import Field from "../../../../UI/forms/field";
import useForm from "../../../../UI/forms/hooks/use-form";
import { z, ZodError } from "zod"; // Pour la validation des données
import { regexGeneric } from "../../../../../utils/constantes";
import { validationErrors } from "../../../../../helpers/validate";

// Props du composant
type Props = {
  resource: Resource; // La ressource à modifier
  onSubmit: (value: string, id: number) => void; // Fonction appelée lors de la soumission du formulaire
  onCancel: () => void; // Fonction appelée lors de l'annulation
};

/**
 * Composant permettant de modifier le titre d'une ressource sous forme de modal
 * @param resource - La ressource à modifier
 * @param onSubmit - Fonction appelée lors de la soumission du formulaire
 * @param onCancel - Fonction appelée lors de l'annulation
 */
function ResourceUpdate({ resource, onSubmit, onCancel }: Props) {
  // Utilisation du hook useForm pour gérer le formulaire
  const { values, errors, initValues, onChangeValue, onValidationErrors } =
    useForm();

  // Initialisation des valeurs du formulaire avec le titre actuel de la ressource
  useEffect(() => {
    initValues({ label: resource.label });
  }, [initValues, resource]);

  // Données du formulaire regroupées dans un objet pour faciliter la transmission
  const data = { values, errors, onChangeValue };

  // Schéma de validation Zod pour le titre de la ressource
  const schema = z.object({
    label: z
      .string({ required_error: "Le nom de la ressource est  requis." })
      .regex(regexGeneric, {
        message:
          "Le nom de la ressource contient des caractères non autorisés.",
      }),
  });

  /**
   * Gère la soumission du formulaire
   * Valide les données et appelle onSubmit si tout est correct
   */
  const handleSubmit = () => {
    try {
      // Validation des données avec le schéma Zod
      schema.parse(values);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // En cas d'erreur de validation, on met à jour les erreurs dans le formulaire
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }
    // Si la validation est réussie, on appelle onSubmit avec les nouvelles valeurs
    onSubmit(values.label, resource.id);
  };

  return (
    // Modal pour l'édition du titre
    <div className="modal modal-open  " role="dialog">
      <div className="modal-box">
        <div className="flex flex-col gap-y-4">
          <h2>Modification du nom de la ressource</h2>
          {/* Champ de saisie pour le nouveau nom */}
          <Field name="label" label="" type="text" data={data} />
          {/* Message d'information pour la modification du fichier */}
          <span className="flex justify-center items-center gap-x-2">
            <p className="text-xs">
              Si vous souhaitez modifier le fichier de la ressource : veuillez
              effacer la ressource et créez en une nouvelle.
            </p>
          </span>

          {/* Boutons d'action */}
          <span className="flex justify-end items-center gap-x-4">
            {/* Bouton d'annulation */}
            <button
              className="btn btn-secondary btn-outline"
              onClick={onCancel}
            >
              Annuler
            </button>
            {/* Bouton de validation */}
            <button className="btn btn-primary" onClick={handleSubmit}>
              Modifier
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default ResourceUpdate;
