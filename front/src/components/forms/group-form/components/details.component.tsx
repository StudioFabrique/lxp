import { FC, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import ImageFileUpload from "../../../UI/image-file-upload/image-file-upload";

const Details: FC<{}> = () => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Details</h2>
      <span>
        <label>Formation visée</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px] placeholder:text-purple-discrete"
          type="text"
          autoComplete="off"
        />
      </span>
      <span>
        <label>Parcours visé</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px] placeholder:text-purple-discrete"
          type="text"
          autoComplete="off"
        />
      </span>
    </Wrapper>
  );
};
export default Details;
