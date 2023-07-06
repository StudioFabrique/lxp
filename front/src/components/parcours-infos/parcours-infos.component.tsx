import { FC, useEffect, useMemo, useState } from "react";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import { autoSubmitTimer } from "../../config/auto-submit-timer";
import ImageFileUpload from "../UI/image-file-upload/image-file-upload";
import Wrapper from "../UI/wrapper/wrapper.component";

const ParcoursInfos: FC<{
  onSubmitInformations: (infos: any) => void;
}> = ({ onSubmitInformations }) => {
  const { value: title } = useInput((value) => regexGeneric.test(value.trim()));
  const { value: description } = useInput((value) =>
    regexGeneric.test(value.trim())
  );
  const { value: degree } = useInput((value) =>
    regexGeneric.test(value.trim())
  );
  const [file, setFile] = useState<File | null>(null);

  const infos = useMemo(() => {
    return {
      title: title.value,
      description: description.value,
      degree: degree.value,
      file,
    };
  }, [title.value, description.value, degree.value, file]);

  let formIsValid = title.isValid && description.isValid && degree.isValid;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formIsValid) {
        onSubmitInformations(infos);
      }
    }, autoSubmitTimer);

    return () => {
      clearTimeout(timer);
    };
  }, [infos, onSubmitInformations, formIsValid, file]);

  return (
    <Wrapper>
      <h3 className="font-bold text-xl">Informations</h3>
      <form className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <label htmlFor="title">Titre</label>
          <input
            className="input input-sm w-full"
            name="title"
            type="text"
            value={title.value}
            onChange={title.valueChangeHandler}
            onBlur={title.valueBlurHandler}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="description">Description</label>
          <textarea
            className="textarea w-full"
            name="description"
            value={description.value}
            onChange={description.textAreaChangeHandler}
            onBlur={description.valueBlurHandler}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="degree">Diplôme</label>
          <input
            className="input input-sm w-full"
            name="degree"
            type="text"
            value={degree.value}
            onChange={degree.valueChangeHandler}
            onBlur={degree.valueBlurHandler}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <ImageFileUpload maxSize={2 * 1024 * 1024} onSetFile={setFile} />
        </div>
      </form>
    </Wrapper>
  );
};

export default ParcoursInfos;
