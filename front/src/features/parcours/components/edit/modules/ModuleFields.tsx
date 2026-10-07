import { UseFormRegister, FieldErrors } from "react-hook-form";
import FormInput from "../../../../../components/form/FormInput";
import FormTextarea from "../../../../../components/form/FormTextarea";
import type { ModuleCreateFormValues } from "../../../parcours.schema";

type Props = {
  children?: React.ReactNode;
  register: UseFormRegister<ModuleCreateFormValues>;
  errors: FieldErrors<ModuleCreateFormValues>;
};

function ModuleFields({
  register,
  errors,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <FormInput
          label="Titre du module *"
          name="title"
          placeholder="Ex : Javascript"
          register={register}
          error={errors.title}
        />
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

      {children}
    </div>
  );
}

export default ModuleFields;
