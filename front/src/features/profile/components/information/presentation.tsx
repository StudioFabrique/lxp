import { FC } from "react";
import { UseFormRegister } from "react-hook-form";
import FormTextarea from "../../../../components/form/FormTextarea";
import Wrapper from "../../../../components/wrappers/BoxWrapper";

type FormProps = {
  register: UseFormRegister<any>;
  errors: any;
};

const Presentation: FC<{ formProps: FormProps }> = ({ formProps }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Presentation</h3>
      <Wrapper>
        <p>Qui suis-je ?</p>
        <FormTextarea
          name="description"
          label="Description"
          register={formProps.register}
          error={formProps.errors.description}
          rows={7}
        />
      </Wrapper>
    </div>
  );
};

export default Presentation;
