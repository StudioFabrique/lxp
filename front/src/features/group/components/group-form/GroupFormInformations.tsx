import { FC } from "react";
import { UseFormRegister } from "react-hook-form";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import FormInput from "../../../../../src/components/form/FormInput";
import FormTextarea from "../../../../../src/components/form/FormTextarea";
import Group from "../../../../../src/utils/interfaces/group";

const GroupFormInformations: FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  onSetFile: (file: File) => void;
  group?: Group;
  isLoading?: boolean;
}> = ({ register, errors, isLoading }) => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Informations</h2>
      <span className="max-w-[70vh] flex flex-col gap-y-4">
        <FormInput
          label="Titre du groupe *"
          placeholder="Ex: Promo 2025"
          name="name"
          register={register}
          error={errors.name}
          disabled={isLoading}
        />
        <FormTextarea
          label="Description du groupe"
          name="desc"
          register={register}
          error={errors.desc}
          disabled={isLoading}
        />
      </span>
    </Wrapper>
  );
};

export default GroupFormInformations;
