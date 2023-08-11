import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
} from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import ImageFileUpload from "../../../UI/image-file-upload/image-file-upload";

const Informations: FC<{
  name: any;
  desc: any;
  isActive: any;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}> = ({ name, desc, isActive, setIsActive }) => {
  const handleSetFile = (file: File) => {};
  const handleToggle: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setIsActive(event.target.checked);
  };
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Informations</h2>
      <span className="flex flex-col gap-y-2">
        <label>Titre du groupe</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px]"
          type="text"
          onChange={name.valueChangeHandler}
          onBlur={name.valueBlurHandler}
          defaultValue={name.value}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Description du groupe</label>
        <textarea
          className="textarea w-full p-[20px] pl-[30px] placeholder:text-purple-discrete"
          onChange={desc.valueChangeHandler}
          onBlur={desc.valueBlurHandler}
          defaultValue={desc.value}
          autoComplete="off"
        />
      </span>
      <span className="flex row gap-x-5">
        <label>Statut</label>
        <input
          className="toggle "
          type="checkbox"
          onChange={handleToggle}
          defaultValue={isActive}
          autoComplete="off"
        />
        <label>Actif</label>
      </span>
      <ImageFileUpload
        maxSize={10000000000000000}
        onSetFile={handleSetFile}
        type={2}
      />
    </Wrapper>
  );
};

export default Informations;
