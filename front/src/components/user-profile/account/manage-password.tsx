import { FC } from "react";
import { UseFormRegister } from "react-hook-form";
import Wrapper from "../../wrappers/BoxWrapper";
import FormPasswordInput from "../../form/FormPasswordInput";

type FormProps = {
  register: UseFormRegister<any>;
  errors: any;
};

const ManagePassword: FC<{ formProps: FormProps }> = ({ formProps }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Changer le mot de passe</h3>
      <Wrapper>
        <div className="flex flex-col gap-4">
          <FormPasswordInput
            label="Ancien mot de passe"
            name="oldPass"
            register={formProps.register}
            error={formProps.errors.oldPass}
          />
          <FormPasswordInput
            label="Nouveau mot de passe"
            name="newPass"
            register={formProps.register}
            error={formProps.errors.newPass}
          />
          <FormPasswordInput
            label="Confirmer le nouveau mot de passe"
            name="confirmNewPass"
            register={formProps.register}
            error={formProps.errors.confirmNewPass}
          />
        </div>
      </Wrapper>
    </div>
  );
};

export default ManagePassword;
