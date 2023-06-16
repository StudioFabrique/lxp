import { ChangeEvent, FC } from "react";

const PaginationSelect: FC<{
  handleSetPerPages: (event: ChangeEvent<HTMLSelectElement>) => void;
  perPage?: number;
}> = ({ handleSetPerPages, perPage }) => {
  if (perPage) {
    return (
      <div className="flex justify-end self-end">
        <p>row per pages :</p>
        <select
          onChange={handleSetPerPages}
          className="select select-sm bg-secondary"
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
