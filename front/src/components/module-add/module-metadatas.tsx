import { useEffect } from "react";
import CustomError from "../../utils/interfaces/custom-error";
import useImageUpload from "../../hooks/use-image-upload";
import bgImageGradient from "../../utils/bg-image-gradient";
import defaultImage from "../../assets/images/module-default.jpg";
import Field from "../UI/forms/field";
import FieldArea from "../UI/forms/field-area";
import FormUploadImage from "../UI/form-upload-image";
type Props = {
  children?: React.ReactNode;
  mode: "create" | "edit";
  thumb: string | null;
  data: {
    values: Record<string, unknown>;
    onChangeValue: (field: string, value: unknown) => void;
    errors: CustomError[];
  };
  onSetFile: (file: File | null) => void;
  onSetImageBase64?: (base64: string | null) => void;
};

function ModuleMetadatas({
  data,
  mode,
  thumb,
  onSetFile,
  children,
  onSetImageBase64,
}: Props) {
  const { image, handleFileChange } = useImageUpload(5000000, onSetFile);

  // affiche un aperçu de l'image choisie pour le module ou une image en background de div de manière dynamique
  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(
      image ? image : thumb ? `data:image/jpeg;base64,${thumb}` : defaultImage,
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
        {/* titre */}

        <div>
          <Field
            label="Titre du module *"
            name="title"
            placeholder="Ex : Javascript"
            data={data}
            isDisabled={mode === "edit"}
          />
        </div>

        {/* description */}

        <FieldArea
          label="Description"
          name="description"
          data={data}
          isDisabled={mode === "edit"}
        />

        <div className="flex flex-col gap-2">
          <FieldArea
            label="Instructions pour le quiz"
            tooltip="Utilisez ce champ pour donner des indications à l'IA pour générer le quiz de début de module."
            name="quizInstructions"
            data={data}
            isDisabled={mode === "edit"}
          />
          <p className="text-base-content/40 text-xs">
            Exemple : Questionnaire diagnostique en français, ton clair et
            pédagogique. Priorité aux prérequis et bases avant le module.
            Inclure uniquement des questions auto-corrigeables. Éviter
            l'ambiguïté.
          </p>
        </div>

        {/* duration */}

        {children ? children : null}

        {/* image du module */}

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
