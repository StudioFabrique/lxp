import { useEffect } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { normalizeImageSource } from "../../../../../../src/utils/images/image-source";
import useImageUpload from "../../../../../../src/hooks/use-image-upload";
import defaultImage from "../../../../../../src/assets/images/module-default.jpg";
import { bgImageGradient } from "../../../../../../src/utils/helpers/color-helpers";
import FormInput from "../../../../../components/form/FormInput";
import FormTextarea from "../../../../../components/form/FormTextarea";
import FormUploadImage from "../../../../../components/UI/form-upload-image";

type Props = {
  children?: React.ReactNode;
  mode: "create" | "edit";
  thumb: string | null;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSetFile: (file: File | null) => void;
  onSetImageBase64?: (base64: string | null) => void;
};

function ModuleMetadatas({
  register,
  errors,
  mode,
  thumb,
  onSetFile,
  children,
  onSetImageBase64,
}: Props) {
  const { image, handleFileChange } = useImageUpload(5000000, onSetFile);

  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(
      image ? image : thumb ? normalizeImageSource(thumb) : defaultImage,
    ),
    width: "100px",
    height: "75px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "5px",
    marginRight: "10px",
  };

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
            disabled={mode === "edit"}
          />
        </div>

        <FormTextarea
          label="Description"
          name="description"
          register={register}
          error={errors.description as any}
          disabled={mode === "edit"}
        />

        <div className="flex flex-col gap-2">
          <FormTextarea
            label="Instructions pour le quiz"
            name="quizInstructions"
            register={register}
            error={errors.quizInstructions as any}
            disabled={mode === "edit"}
          />
          <p className="text-base-content/40 text-xs">
            Exemple : Questionnaire diagnostique en français, ton clair et
            pédagogique. Priorité aux prérequis et bases avant le module.
            Inclure uniquement des questions auto-corrigeables. Éviter
            l'ambiguïté.
          </p>
        </div>

        {children ? children : null}

        <div className="w-full h-full flex gap-x-4 items-center">
          <FormUploadImage
            onSetFile={handleFileChange}
            isDisabled={mode === "edit"}
          />
          <span style={classImage} />
        </div>
      </article>
    </div>
  );
}

export default ModuleMetadatas;
