import { useEffect } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import useImageUpload from "../../../../../../src/hooks/use-image-upload";
import FormInput from "../../../../../components/form/FormInput";
import FormTextarea from "../../../../../components/form/FormTextarea";
import FormUploadImage from "../../../../../components/UI/form-upload-image";

type Props = {
  children?: React.ReactNode;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSetFile: (file: File | null) => void;
  onSetImageBase64?: (base64: string | null) => void;
};

function ModuleMetadatas({
  register,
  errors,
  onSetFile,
  children,
  onSetImageBase64,
}: Props) {
  const { image, handleSelectedFile } = useImageUpload(5000000, onSetFile);

  useEffect(() => {
    if (onSetImageBase64) onSetImageBase64(image);
  }, [image, onSetImageBase64]);

  return (
    <div>
      <article className="flex flex-col gap-y-4">
        <div>
          <FormInput
            label="Titre du module *"
            name="title"
            placeholder="Ex : Javascript"
            register={register}
            error={errors.title as any}
          />
        </div>

        <FormTextarea
          label="Description"
          name="description"
          register={register}
          error={errors.description as any}
        />

        <div className="flex flex-col gap-2">
          <FormTextarea
            label="Instructions pour le quiz"
            name="quizInstructions"
            register={register}
            error={errors.quizInstructions as any}
          />
          <p className="text-base-content/40 text-xs">
            Exemple : Questionnaire diagnostique en français, ton clair et
            pédagogique. Priorité aux prérequis et bases avant le module.
            Inclure uniquement des questions auto-corrigeables. Éviter
            l'ambiguïté.
          </p>
        </div>

        {children ? children : null}

        <div className="w-full h-full flex flex-col gap-2">
          <p className="text-sm font-bold">Image du module</p>
          <FormUploadImage onSetFile={handleSelectedFile} />
          {!image && (
            <p className="text-base-content/40 text-xs">
              Une image sera générée automatiquement si aucune n'est importée.
            </p>
          )}
        </div>
      </article>
    </div>
  );
}

export default ModuleMetadatas;
