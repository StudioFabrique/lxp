/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Field from "../../../UI/forms/field";
import FieldArea from "../../../UI/forms/field-area";
import CustomError from "../../../../utils/interfaces/custom-error";

const Informations: FC<{
  values: Record<string, string>;
  onChangeValue: (field: string, value: string) => void;
  errors: CustomError[];
  isActive: any;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  onSetFile: (file: File) => void;
}> = ({ values, errors, onChangeValue, isActive, setIsActive, onSetFile }) => {
  const handleToggle: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setIsActive(event.target.checked);
  };

  const data = {
    values,
    onChangeValue,
    errors,
  };

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Informations</h2>

      <Field
        label="Titre du groupe *"
        placeholder="Ex: Promo 2025"
        name="name"
        data={data}
      />

      {/*       <span className="flex flex-col gap-y-2">
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
      </span> */}

      <FieldArea label="Description du groupe *" name="desc" data={data} />

      {/* 
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
      </span> */}

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
