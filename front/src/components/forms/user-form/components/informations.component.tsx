import { FC } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import ImageFileUpload from "../../../UI/image-file-upload/image-file-upload";

const Informations: FC<{
  lastname: any;
  firstname: any;
  pseudo: any;
  email: any;
}> = ({ lastname, firstname, pseudo, email }) => {
  const handleSetFile = () => {};

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Informations</h2>
      <span>
        <label>Nom *</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={lastname.valueChangeHandler}
          onBlur={lastname.valueBlurHandler}
          defaultValue={lastname.value}
          autoComplete="off"
        />
      </span>
      <span>
        <label>Prénom *</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={firstname.valueChangeHandler}
          onBlur={firstname.valueBlurHandler}
          defaultValue={firstname.value}
          autoComplete="off"
        />
      </span>
      <span>
        <label>Pseudo</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={pseudo.valueChangeHandler}
          onBlur={pseudo.valueBlurHandler}
          defaultValue={pseudo.value}
          autoComplete="off"
        />
      </span>
      <span>
        <label>Adresse Mail *</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={email.valueChangeHandler}
          onBlur={email.valueBlurHandler}
          defaultValue={email.value}
          autoComplete="off"
        />
      </span>
      <ImageFileUpload onSetFile={handleSetFile} maxSize={5} />
    </Wrapper>
  );
};

export default Informations;
