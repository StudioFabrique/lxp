/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";

const Presentation: FC<{ description: any; disabled?: boolean }> = ({
  description,
  disabled,
}) => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Présentation</h2>
      <label>Qui suis-je ?</label>
      <textarea
        className="textarea h-26 w-full p-2"
        onChange={description.valueChangeHandler}
        onBlur={description.valueBlurHandler}
        defaultValue={description.value}
        autoComplete="off"
        disabled={disabled}
      />
    </Wrapper>
  );
};

export default Presentation;
