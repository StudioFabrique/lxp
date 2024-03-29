import { FC } from "react";
import CustomError from "../../../utils/interfaces/custom-error";
import FieldArea from "../../UI/forms/field-area";
import Wrapper from "../../UI/wrapper/wrapper.component";

type FormProps = {
  values: Record<string, string>;
  errors: CustomError[];
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
};

const Presentation: FC<{ formProps: FormProps }> = ({ formProps }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Presentation</h3>
      <Wrapper>
        <p>Qui je suis ?</p>
        <FieldArea name="description" data={formProps} />
      </Wrapper>
    </div>
  );
};

export default Presentation;
