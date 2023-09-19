import { FC } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";

const Presentation: FC<{ description: any }> = ({ description }) => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Présentation</h2>
      <label>Qui suis-je ?</label>
      <textarea
        className="textarea h-52 w-full p-2"
        onChange={description.valueChangeHandler}
        onBlur={description.valueBlurHandler}
        defaultValue={description.value}
        autoComplete="off"
      />
    </Wrapper>
  );
};

export default Presentation;
