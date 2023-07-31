import { FC, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import { autoSubmitTimer } from "../../config/auto-submit-timer";
//import ImageFileUpload from "../UI/image-file-upload/image-file-upload";
import Wrapper from "../UI/wrapper/wrapper.component";

const ParcoursInfos: FC<{
  onSubmitInformations: (infos: any) => void;
}> = ({ onSubmitInformations }) => {
  const parcoursInfos = useSelector(
    (state: any) => state.parcoursInformations.infos
  );
  const { value: title } = useInput(
    (value) => regexGeneric.test(value.trim()),
    parcoursInfos.title
  );
  const { value: description } = useInput(
    (value) => regexGeneric.test(value.trim()),
    parcoursInfos.description
  );
  const { value: degree } = useInput(
    (value) => regexGeneric.test(value.trim()),
    parcoursInfos.degree
  );

  const infos = useMemo(() => {
    return {
      title: title.value,
      description: description.value,
      degree: degree.value,
    };
  }, [title.value, description.value, degree.value]);

  let formIsValid = title.isValid;

  useEffect(() => {
    const setInfos = async () => {
      if (formIsValid) {
        onSubmitInformations({
          title: infos.title,
          description: infos.description,
          degree: infos.degree,
        });
      }
    };
    const timer = setTimeout(() => {
      setInfos();
    }, autoSubmitTimer);

    return () => {
      clearTimeout(timer);
    };
  }, [infos, onSubmitInformations, formIsValid /* file */]);

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
      </form>
    </Wrapper>
  );
};

export default ParcoursInfos;
