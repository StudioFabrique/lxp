import Field from "../../../components/UI/forms/field";
import FieldArea from "../../../components/UI/forms/field-area";
import FieldNumber from "../../../components/UI/forms/field-number";
import MemoizedImageFileUpload from "../../../components/UI/image-file-upload/image-file-upload";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import { headerImageMaxSize } from "../../../config/images-sizes";

type Props = {
  data: any;
};

function ModuleMetadatas({ data }: Props) {
  // affiche une image en background d'une div de manière dynamique
  const classImage: React.CSSProperties = {
    backgroundImage: `url("https://picsum.photos/200/300")`,
    width: "100px",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "5px",
    marginRight: "10px",
  };

  return (
    <Wrapper>
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

        <div className="w-full flex gap-x-4 items-center">
          <MemoizedImageFileUpload
            maxSize={headerImageMaxSize}
            label="Choisir une nouvelle image *"
            onSetFile={() => {}}
          />
          <span style={classImage} />
        </div>
      </article>
    </Wrapper>
  );
}

export default ModuleMetadatas;
