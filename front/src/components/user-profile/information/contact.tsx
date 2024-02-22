import { FC } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Field from "../../UI/forms/field";
import CustomError from "../../../utils/interfaces/custom-error";

type FormProps = {
  values: Record<string, string>;
  errors: CustomError[];
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
};

const Contact: FC<{ formProps: FormProps }> = ({ formProps }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Contacts</h3>
      <Wrapper>
        <div className="flex flex-col gap-4">
          <Field name="address" label="Adresse" data={formProps} />
          <Field name="city" label="Ville" data={formProps} />
          <Field name="postCode" label="Code Postal" data={formProps} />
          <Field name="phoneNumber" label="Telephone" data={formProps} />
        </div>
      </Wrapper>
    </div>
  );
};

export default Contact;
