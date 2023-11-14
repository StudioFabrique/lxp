import { ChangeEvent, FC } from "react";

const PaginationSelect: FC<{
  handleSetPerPages: (event: ChangeEvent<HTMLSelectElement>) => void;
  perPage?: number;
}> = ({ handleSetPerPages, perPage }) => {
  if (perPage) {
    return (
      <div className="flex justify-end items-center focus:outline-none gap-x-2 self-end">
        <p>row per pages :</p>
        <select
          defaultValue={perPage}
          onChange={handleSetPerPages}
          className="select select-sm bg-secondary/50"
        >
          <option>5</option>
          <option>10</option>
          <option>15</option>
        </select>
      </div>
    );
  }

  return <></>;
};

export default PaginationSelect;
