import { useEffect } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import useImageUpload from "../../../../../../src/hooks/use-image-upload";
import FormInput from "../../../../../components/form/FormInput";
import FormTextarea from "../../../../../components/form/FormTextarea";
import FormUploadImage from "../../../../../components/UI/form-upload-image";
import type { ModuleCreateFormValues } from "../../../parcours.schema";

type Props = {
  children?: React.ReactNode;
  mode?: "edit" | "create";
  register: UseFormRegister<ModuleCreateFormValues>;
  errors: FieldErrors<ModuleCreateFormValues>;
  onSetFile: (file: File | null) => void;
  onSetImageBase64?: (base64: string | null) => void;
};

function ModuleFields({
  register,
  errors,
  onSetFile,
  children,
  onSetImageBase64,
  mode = "edit",
}: Props) {
  const { image, handleSelectedFile } = useImageUpload(5000000, onSetFile);

  useEffect(() => {
    if (onSetImageBase64) onSetImageBase64(image);
  }, [image, onSetImageBase64]);

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

      <div className="flex w-full flex-col gap-2">
        <p className="text-sm font-bold">
          {mode === "edit" ? "Modifier l'image du module" : "Image du module"}
        </p>
        <FormUploadImage onSetFile={handleSelectedFile} />
        {!image && mode === "create" && (
          <p className="text-xs text-base-content/50">
            Une image sera générée automatiquement si aucune n'est importée.
          </p>
        )}
      </div>
    </div>
  );
}

export default ModuleFields;
