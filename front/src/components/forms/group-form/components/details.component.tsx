import { FC } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import ImageFileUpload from "../../../UI/image-file-upload/image-file-upload";

const Details: FC<{ promotion: any; desc: any }> = ({ promotion, desc }) => {
  const handleSetFile = (file: File) => {};

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Details</h2>
      <span>
        <label>Promotion</label>
        <input
          className="input input-sm w-full p-[20px] pl-[30px] placeholder:text-purple-discrete"
          type="text"
          onChange={promotion.valueChangeHandler}
          onBlur={promotion.valueBlurHandler}
          defaultValue={promotion.value}
          autoComplete="off"
        />
      </span>
      <span>
        <label>Description du groupe</label>
        <textarea
          className="textarea w-full p-[20px] pl-[30px] placeholder:text-purple-discrete"
          onChange={desc.valueChangeHandler}
          onBlur={desc.valueBlurHandler}
          defaultValue={desc.value}
          autoComplete="off"
        />
      </span>
      <ImageFileUpload maxSize={5} onSetFile={handleSetFile} />
    </Wrapper>
  );
};
export default Details;
