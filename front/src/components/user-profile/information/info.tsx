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

const Info: FC<{ formProps: FormProps }> = ({ formProps }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">Information</h3>
      <Wrapper>
        <div className="flex flex-col gap-4">
          <Field name="firstname" label="Prénom" data={formProps} />
          <Field name="lastname" label="Nom" data={formProps} />
          <Field name="nickname" label="Pseudo" data={formProps} />
        </div>
      </Wrapper>
    </div>
  );
};

export default Info;
