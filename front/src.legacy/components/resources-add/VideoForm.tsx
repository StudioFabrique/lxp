import { ChangeEvent } from "react";
import Field from "../UI/forms/field";
import Wrapper from "../UI/wrapper/wrapper.component";
import CustomError from "../../utils/interfaces/custom-error";
import VideoPlayer from "../UI/VideoPlayer";

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
  //const [origin, setOrigin] = useState<"web" | "file">("web"); // Source de la vidéo (web/fichier)

  /*   const handleOnChangeOrigin = (event: ChangeEvent<HTMLSelectElement>) => {
    const newOrigin = event.currentTarget.value as "web" | "file";
    setOrigin(newOrigin);
    props.data.onChangeValue("videoSource", newOrigin);
    if (newOrigin !== "web") {
      props.onSetFile({
        target: { files: null },
      } as unknown as ChangeEvent<HTMLInputElement>);
    }
  };
  */

  return (
    <form className="flex flex-col gap-y-2">
      <Wrapper>
        <Field
          label="Titre *"
          placeholder="Titre de l'activité"
          name="title"
          data={props.data}
        />
      </Wrapper>

      {/*      <Wrapper>
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
      </Wrapper>*/}

      <Wrapper>
        <span className="flex justify-between items-start gap-x-8">
          <Field
            label="URL de la vidéo *"
            placeholder="https://www.youtube.com/..."
            name="url"
            data={props.data}
          />
          <VideoPlayer url={props.data.values.url as string} />
        </span>
      </Wrapper>

      {/*        <Wrapper>
          <div className="flex justify-end">
            <input
              className="file-input file-input-bordered file-input-sm file-input-primary"
              type="file"
              name="fileUpload"
              id="fileUpload"
              onChange={props.onSetFile}
            />
          </div>
        </Wrapper>*/}

      <div className="flex justify-end gap-x-4 items-center mt-4">
        <button
          className="btn btn-secondary btn-outline"
          type="button"
          onClick={props.onClose}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={props.onSubmit}
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
