import { useState } from "react";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import ImageFileUpload from "../UI/image-file-upload/image-file-upload";

const CreateBadge = () => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) => regexGeneric.test(value));
  const [file, setFile] = useState<File | null>(null);

  return (
    <form className="flex flex-col px-4 gap-y-4" onSubmit={() => {}}>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="title">Nom du Bage *</label>
        <input
          className="input input-group-sm focus:outline-none bg-secondary/20"
          value={title.value}
          onChange={title.valueChangeHandler}
          onBlur={title.valueBlurHandler}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <label htmlFor="title">Description *</label>
        <textarea
          className="textarea focus:outline-none bg-secondary/20"
          value={description.value}
          onChange={description.textAreaChangeHandler}
          onBlur={description.valueBlurHandler}
        />
      </div>

      <div>
        <div className="flex flex-col gap-y-1">
          <ImageFileUpload maxSize={2 * 1024 * 1024} onSetFile={setFile} />
        </div>
      </div>

      <div className="divider" />
      <div className="w-full flex justify-end mt-8">
        <div className="flex gap-x-4">
          <button
            className="btn btn-outline btn-sm btn-primary font-normal w-32"
            type="reset"
            onClick={() => {}}
          >
            Annuler
          </button>
          <button className="btn btn-primary btn-sm w-32">Valider</button>
        </div>
      </div>
    </form>
  );
};

export default CreateBadge;
