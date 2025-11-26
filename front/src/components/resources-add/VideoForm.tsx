import { ChangeEvent, useState } from "react";
import Field from "../UI/forms/field";
import FieldArea from "../UI/forms/field-area";
import Wrapper from "../UI/wrapper/wrapper.component";
import CustomError from "../../utils/interfaces/custom-error";

type Props = {
  mode: "read" | "edit" | "write";
  data: {
    values: Record<string, unknown>;
    errors: CustomError[];
    onChangeValue: (field: string, value: unknown) => void;
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSetFile: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function VideoForm(props: Props) {
  const [origin, setOrigin] = useState<"web" | "file">("web"); // Source de la vidéo (web/fichier)

  const handleOnChangeOrigin = (event: ChangeEvent<HTMLSelectElement>) => {
    setOrigin(event.currentTarget.value as "web" | "file");
  };

  return (
    <form className="flex flex-col gap-y-2">
      <Wrapper>
        <Field
          label="Titre *"
          placeholder="Titre de la video"
          name="title"
          data={props.data}
        />
      </Wrapper>

      <Wrapper>
        <FieldArea label="Description" name="description" data={props.data} />
      </Wrapper>

      <Wrapper>
        <span className="flex justify-between items-center">
          <label className="label">Source de la vidéo *</label>{" "}
          <select
            className="select select-bordered w-full max-w-xs"
            name="videoSource"
            value={origin}
            onChange={handleOnChangeOrigin}
          >
            <option value="web">Vidéo en ligne (URL)</option>
            <option value="file">Fichier vidéo</option>
          </select>
        </span>
      </Wrapper>

      {origin === "web" ? (
        <Wrapper>
          <Field
            label="URL de la vidéo *"
            placeholder="https://www.youtube.com/..."
            name="url"
            data={props.data}
          />
        </Wrapper>
      ) : (
        <input
          className="w-full file-input file-input-bordered file-input-sm file-input-primary"
          type="file"
          name="fileUpload"
          id="fileUpload"
          onChange={props.onSetFile}
        />
      )}
      <div>
        <button
          type="submit"
          className="btn btn-primary mt-4"
          onClick={props.onSubmit}
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
