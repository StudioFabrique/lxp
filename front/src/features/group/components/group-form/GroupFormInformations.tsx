import { useFormContext } from "react-hook-form";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import FormInput from "../../../../../src/components/form/FormInput";
import type { GroupFormValues } from "../../group.schema";

const GroupFormInformations = ({
  isLoading,
}: {
  isLoading?: boolean;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<GroupFormValues>();

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
      </span>
    </Wrapper>
  );
};

export default GroupFormInformations;
