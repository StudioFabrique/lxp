import { UseFormRegister, FieldErrors } from "react-hook-form";
import FormInput from "../../../../../components/form/FormInput";
import FormTextarea from "../../../../../components/form/FormTextarea";
import type { ModuleCreateFormValues } from "../../../parcours.schema";

type Props = {
  /** Champs affichés sous le titre, dans l'espace libre à côté de l'image. */
  children?: React.ReactNode;
  /** Contenu affiché à côté du champ titre (ex. image du module). */
  titleAside?: React.ReactNode;
  register: UseFormRegister<ModuleCreateFormValues>;
  errors: FieldErrors<ModuleCreateFormValues>;
};

function ModuleFields({
  register,
  errors,
  children,
  titleAside,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <FormInput
            label="Titre du module *"
            name="title"
            placeholder="Ex : Javascript"
            register={register}
            error={errors.title}
          />
          {children}
        </div>
        {titleAside}
      </div>

      <div>
        <FormTextarea
          label="Description"
          name="description"
          register={register}
          error={errors.description}
        />
      </div>

      <div
        className="flex flex-col gap-2"
      >
        <FormTextarea
          label="Instructions pour le quiz *"
          name="quizInstructions"
          register={register}
          error={errors.quizInstructions}
        />
        <p className="text-xs leading-relaxed text-base-content/50">
          Exemple : questionnaire diagnostique en français, au ton clair et
          pédagogique, centré sur les prérequis et composé uniquement de
          questions auto-corrigeables.
        </p>
      </div>
    </div>
  );
}

export default ModuleFields;
