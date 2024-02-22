import { FC, Ref, useState } from "react";
import CustomError from "../../../utils/interfaces/custom-error";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Field from "../../UI/forms/field";
import { EyeIcon } from "lucide-react";

type FormProps = {
  values: Record<string, string>;
  errors: CustomError[];
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
};

const ManagePassword: FC<{
  formProps: FormProps;
  firstInputRef: Ref<HTMLInputElement>;
}> = ({ formProps, firstInputRef }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Changer le mot de passe</h3>
      <Wrapper>
        <div className="flex flex-col gap-4">
          <Field
            fieldRef={firstInputRef}
            type="password"
            name="oldPass"
            label="Ancien mot de passe"
            data={formProps}
          />
          <span className="flex gap-5">
            <Field
              name="newPass"
              type={showPassword ? "text" : "password"}
              label="Nouveau mot de passe"
              data={formProps}
            />
            <EyeIcon
              className="translate-y-9 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </span>

          <Field
            name="confirmNewPass"
            type={showPassword ? "text" : "password"}
            label="Confirmer le nouveau mot de passe"
            data={formProps}
          />
        </div>
      </Wrapper>
    </div>
  );
};

export default ManagePassword;
