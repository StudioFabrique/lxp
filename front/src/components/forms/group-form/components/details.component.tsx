import { FC } from "react";

const Details: FC<{ promotion: any; desc: any }> = ({ promotion, desc }) => {
  return (
    <div className="p-4 bg-slate-100/80 rounded-2xl">
      <h2 className="font-bold text-lg">Details</h2>
      <span>
        <label>Promotion</label>
        <input
          className="input w-full bg-indigo-100/60 p-[20px] pl-[30px] placeholder:text-purple-discrete"
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
          className="textarea w-full bg-indigo-100/60 p-[20px] pl-[30px] placeholder:text-purple-discrete"
          onChange={desc.valueChangeHandler}
          onBlur={desc.valueBlurHandler}
          defaultValue={desc.value}
          autoComplete="off"
        />
      </span>
      <span>
        <label>Téléverser une image de groupe</label>
        <input
          className="file-input file-input-secondary"
          type="file"
          placeholder="test"
        />
      </span>
    </div>
  );
};
export default Details;
