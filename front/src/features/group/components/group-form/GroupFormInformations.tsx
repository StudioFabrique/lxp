/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import Wrapper from "../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import { headerImageMaxSize } from "../../../../../src.legacy/config/images-sizes";
import MemoizedImageFileUpload from "../../../../../src.legacy/components/UI/image-file-upload/image-file-upload";
import Field from "../../../../../src.legacy/components/UI/forms/field";
import FieldArea from "../../../../../src.legacy/components/UI/forms/field-area";
import CustomError from "../../../../../src/utils/interfaces/custom-error";
import Group from "../../../../../src/utils/interfaces/group";

const GroupFormInformations: FC<{
  values: Record<string, string>;
  onChangeValue: (field: string, value: string) => void;
  errors: CustomError[];
  onSetFile: (file: File) => void;
  group?: Group;
  isLoading?: boolean;
}> = ({ values, errors, onChangeValue, onSetFile, isLoading }) => {
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
          label="Description du groupe"
          name="desc"
          data={data}
          isDisabled={isLoading}
        />
        <MemoizedImageFileUpload
          maxSize={headerImageMaxSize}
          onSetFile={onSetFile}
          label="Téléverser une image de groupe"
          variant="minimized"
        />
      </span>
    </Wrapper>
  );
};

export default GroupFormInformations;
