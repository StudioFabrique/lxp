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
      <div data-onboarding="module-title-field">
        <FormInput
          label="Titre du module *"
          name="title"
          placeholder="Ex : Javascript"
          register={register}
          error={errors.title}
        />
      </div>

      <div data-onboarding="module-description-field">
        <FormTextarea
          label="Description"
          name="description"
          register={register}
          error={errors.description}
        />
      </div>

      <div
        className="flex flex-col gap-2"
        data-onboarding="module-quiz-instructions-field"
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
