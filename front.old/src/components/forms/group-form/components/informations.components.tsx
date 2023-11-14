import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
} from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import { headerImageMaxSize } from "../../../../config/images-sizes";
import MemoizedImageFileUpload from "../../../UI/image-file-upload/image-file-upload";

const Informations: FC<{
  name: any;
  desc: any;
  isActive: any;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  onSetFile: (file: File) => void;
}> = ({ name, desc, isActive, setIsActive, onSetFile }) => {
  const handleToggle: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setIsActive(event.target.checked);
  };
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Informations</h2>
      <span className="flex flex-col gap-y-2">
        <label>Titre du groupe *</label>
        <input
          className={`input ${
            name.hasError && "input-error"
          } input-sm w-full p-5`}
          type="text"
          onChange={name.valueChangeHandler}
          onBlur={name.valueBlurHandler}
          defaultValue={name.value}
          autoComplete="off"
        />
      </span>
      <span className="flex flex-col gap-y-2">
        <label>Description du groupe *</label>
        <textarea
          className={`textarea ${
            desc.hasError && "textarea-error"
          } w-full p-5 placeholder:text-purple-discrete`}
          onChange={desc.valueChangeHandler}
          onBlur={desc.valueBlurHandler}
          defaultValue={desc.value}
          autoComplete="off"
        />
      </span>
      <span className="flex row gap-x-5">
        <label>Statut</label>
        <input
          className="toggle"
          type="checkbox"
          onChange={handleToggle}
          defaultValue={isActive}
          autoComplete="off"
        />
        <label>Actif</label>
      </span>
      <MemoizedImageFileUpload
        maxSize={headerImageMaxSize}
        onSetFile={onSetFile}
        label="Téléverser une image de groupe"
      />
    </Wrapper>
  );
};

export default Informations;
