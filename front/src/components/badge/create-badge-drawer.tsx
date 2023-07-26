import { FormEvent, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import useInput from "../../hooks/use-input";
import { regexGeneric, regexOptionalGeneric } from "../../utils/constantes";
import ImageFileUpload from "../UI/image-file-upload/image-file-upload";
import useHttp from "../../hooks/use-http";
import HttpDrawerButton from "../UI/http-drawer-button/http-drawer-button.component";
import Wrapper from "../UI/wrapper/wrapper.component";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";

const CreateBadge = () => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { isLoading, error } = useHttp();
  const [resultOk, setResultOk] = useState(false);

  let inputStyle = () => {
    let style = "input input-group-sm focus:outline-none bg-secondary/20";
    return title.hasError ? style + " input-error" : style;
  };

  let textareaStyle = () => {
    let style = "textarea focus:outline-none bg-secondary/20";
    return description.hasError ? style + " textarea-error" : style;
  };

  const formIsValid = () => {
    if (title.isValid && previewUrl) {
      if (description && !description.isValid) {
        return false;
      }
      return true;
    }
    return false;
  };

  const submitNewBadge = (event: FormEvent) => {
    event.preventDefault();
    if (formIsValid()) {
      dispatch(
        parcoursSkillsAction.addBadge({
          title: title.value,
          description: description.value,
          image: previewUrl,
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
            className={inputStyle()}
            value={title.value}
            onChange={title.valueChangeHandler}
            onBlur={title.valueBlurHandler}
          />
        </div>
      </Wrapper>

      <Wrapper>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="title">Description</label>
          <textarea
            className={textareaStyle()}
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
