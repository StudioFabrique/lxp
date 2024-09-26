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
import Group from "../../../../utils/interfaces/group";

const Informations: FC<{
  values: Record<string, string>;
  onChangeValue: (field: string, value: string) => void;
  errors: CustomError[];
  isActive: any;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  onSetFile: (file: File) => void;
  group?: Group;
  isLoading?: boolean;
}> = ({
  values,
  errors,
  onChangeValue,
  isActive,
  setIsActive,
  onSetFile,
  isLoading,
}) => {
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
      <span className="max-w-[70vh] flex flex-col gap-y-4">
        <Field
          label="Titre du groupe *"
          placeholder="Ex: Promo 2025"
          name="name"
          data={data}
          isDisabled={isLoading}
        />
        <FieldArea
          label="Description du groupe *"
          name="desc"
          data={data}
          isDisabled={isLoading}
        />

        <span className="flex row gap-x-5">
          <label>Statut</label>
          <input
            className="toggle"
            type="checkbox"
            onChange={handleToggle}
            checked={isActive}
            autoComplete="off"
            disabled={isLoading}
          />
          <label>{isActive ? "Actif" : "Inactif"}</label>
        </span>
        <MemoizedImageFileUpload
          maxSize={headerImageMaxSize}
          onSetFile={onSetFile}
          label="Téléverser une image de groupe"
        />
      </span>
    </Wrapper>
  );
};

export default Informations;
