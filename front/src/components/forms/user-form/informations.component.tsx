import { FC } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ImageFileUpload from "../../UI/image-file-upload/image-file-upload";

const Informations: FC<{
  lastname: any;
  firstname: any;
  nickname: any;
  email: any;
  onSetFile: (file: File) => void;
}> = ({ onSetFile, lastname, firstname, nickname, email }) => {
  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "input input-sm input-bordered focus:outline-none w-full";
  };

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Informations</h2>
      <span className="flex flex-col gap-y-2">
        <label>Nom *</label>
        <input
          className={setInputStyle(lastname.hasError)}
          type="text"
          onChange={lastname.valueChangeHandler}
          onBlur={lastname.valueBlurHandler}
          defaultValue={lastname.value}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Prénom *</label>
        <input
          className={setInputStyle(firstname.hasError)}
          type="text"
          onChange={firstname.valueChangeHandler}
          onBlur={firstname.valueBlurHandler}
          defaultValue={firstname.value}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Pseudo</label>
        <input
          className={setInputStyle(
            nickname.hasError && nickname.value.length > 0
          )}
          type="text"
          onChange={nickname.valueChangeHandler}
          onBlur={nickname.valueBlurHandler}
          defaultValue={nickname.value}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Adresse Mail *</label>
        <input
          className={setInputStyle(email.hasError)}
          type="text"
          onChange={email.valueChangeHandler}
          onBlur={email.valueBlurHandler}
          defaultValue={email.value}
          autoComplete="off"
        />
      </span>
      <ImageFileUpload type={2} onSetFile={onSetFile} maxSize={10000} />
    </Wrapper>
  );
};

export default Informations;
