import { FC, Ref } from "react";
import CustomError from "../../../utils/interfaces/custom-error";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Field from "../../UI/forms/field";

type FormProps = {
  values: Record<string, string>;
  errors: CustomError[];
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
};

const ManagePassword: FC<{
  formProps: FormProps;
  editMode: boolean;
  firstInputRef: Ref<HTMLInputElement>;
}> = ({ formProps, editMode, firstInputRef }) => (
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
          isDisabled={!editMode}
        />
        <Field
          name="newPass"
          type="password"
          label="Nouveau mot de passe"
          data={formProps}
          isDisabled={!editMode}
        />
        <Field
          name="confirmNewPass"
          type="password"
          label="Confirmer le nouveau mot de passe"
          data={formProps}
          isDisabled={!editMode}
        />
      </div>
    </Wrapper>
  </div>
);

export default ManagePassword;
