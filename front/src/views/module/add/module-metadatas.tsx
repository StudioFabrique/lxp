import { Dispatch, SetStateAction } from "react";
import Field from "../../../components/UI/forms/field";
import FieldArea from "../../../components/UI/forms/field-area";
import FieldNumber from "../../../components/UI/forms/field-number";
import useImageUpload from "../../../hooks/use-image-upload";
import CustomError from "../../../utils/interfaces/custom-error";
import FormUploadImage from "../../../components/UI/form-upload-image";

type Props = {
  data: {
    values: Record<string, string>;
    onChangeValue: (field: string, value: string) => void;
    errors: CustomError[];
  };
  onSetFile: Dispatch<SetStateAction<File | null>>;
};

function ModuleMetadatas({ data, onSetFile }: Props) {
  const { image, handleFileChange } = useImageUpload(5000000, onSetFile);
  // affiche un aperçu de l'image choisie pour le module ou une image en background de div de manière dynamique
  const classImage: React.CSSProperties = {
    backgroundImage: `url(${image ? image : "https://picsum.photos/200/300"})`,
    width: "100px",
    height: "75px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "5px",
    marginRight: "10px",
  };

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
          />
        </div>

        {/* description */}

        <FieldArea label="Description" name="description" data={data} />

        {/* duration */}

        <FieldNumber
          label="Durée du module en heures *"
          name="duration"
          placeholder="Ex : 12"
          min={0}
          data={data}
        />

        {/* image du module */}

        <div className="w-full h-full flex gap-x-4 items-center">
          <FormUploadImage onSetFile={handleFileChange} />
          <span style={classImage} />
        </div>
      </article>
    </div>
  );
}

export default ModuleMetadatas;
