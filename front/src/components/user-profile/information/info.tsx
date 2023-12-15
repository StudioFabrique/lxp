import { FC, Ref } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Field from "../../UI/forms/field";
import CustomError from "../../../utils/interfaces/custom-error";

type FormProps = {
  values: Record<string, string>;
  errors: CustomError[];
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
};

const Info: FC<{
  formProps: FormProps;
  editMode: boolean;
  firstInputRef: Ref<HTMLInputElement>;
}> = ({ formProps, editMode, firstInputRef }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">Information</h3>
      <Wrapper>
        <div className="flex flex-col gap-4">
          <Field
            fieldRef={firstInputRef}
            name="firstname"
            label="Prénom"
            data={formProps}
            isDisabled={!editMode}
          />
          <Field
            name="lastname"
            label="Nom"
            data={formProps}
            isDisabled={!editMode}
          />
          <Field
            name="nickname"
            label="Pseudo"
            data={formProps}
            isDisabled={!editMode}
          />
          <Field
            name="email"
            label="Email"
            data={formProps}
            isDisabled={!editMode}
          />
        </div>
      </Wrapper>
    </div>
  );
};

export default Info;
