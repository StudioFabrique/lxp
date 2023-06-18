import { FC } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";

const Presentation: FC<{ description: any }> = ({ description }) => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Présentation</h2>
      <span>
        <label>Qui suis-je ?</label>
        <textarea
          className="input input-sm w-full p-[20px] pl-[30px]"
          onChange={description.valueChangeHandler}
          onBlur={description.valueBlurHandler}
          defaultValue={description.value}
          autoComplete="off"
        />
      </span>
    </Wrapper>
  );
};

export default Presentation;
