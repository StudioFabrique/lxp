import { FormEvent, useCallback, useEffect, useState } from "react";

import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import ImageFileUpload from "../UI/image-file-upload/image-file-upload";
import { useDispatch } from "react-redux";
import { parcoursAction } from "../../store/redux-toolkit/parcours";
import useHttp from "../../hooks/use-http";
import HttpDrawerButton from "../UI/http-drawer-button/http-drawer-button.component";
import Wrapper from "../UI/wrapper/wrapper.component";

const CreateBadge = () => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) => regexGeneric.test(value));
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { isLoading, error } = useHttp();
  const [resultOk, setResultOk] = useState(false);

  let formIsValid = title.isValid && description.isValid && previewUrl;

  const submitNewBadge = (event: FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      console.log("coucou");

      dispatch(
        parcoursAction.addBadge({
          title: title.value,
          description: description.value,
          previewUrl,
        })
      );
      setResultOk(true);
    }
  };

  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  }, [file]);

  const updateFile = useCallback((updatedFile: File) => {
    setFile(updatedFile);
  }, []);

  return (
    <form
      className="flex flex-col px-4 gap-y-4 overflow-y-auto"
      onSubmit={submitNewBadge}
    >
      <Wrapper>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="title">Nom du Badge *</label>
          <input
            className="input input-group-sm focus:outline-none bg-secondary/20"
            value={title.value}
            onChange={title.valueChangeHandler}
            onBlur={title.valueBlurHandler}
          />
        </div>
      </Wrapper>

      <Wrapper>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="title">Description *</label>
          <textarea
            className="textarea focus:outline-none bg-secondary/20"
            value={description.value}
            onChange={description.textAreaChangeHandler}
            onBlur={description.valueBlurHandler}
          />
        </div>
      </Wrapper>

      <Wrapper>
        <ImageFileUpload maxSize={2 * 1024 * 1024} onSetFile={updateFile} />
      </Wrapper>

      <div className="w-full my-4">
        <HttpDrawerButton
          isLoading={isLoading}
          error={error}
          resultOk={resultOk}
        />
      </div>
    </form>
  );
};

export default CreateBadge;
