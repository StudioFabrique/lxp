import { ChangeEvent, FC } from "react";

import PaginationSelect from "./pagination-select.component";

const Pagination: FC<{
  page: number;
  totalPages: number | null;
  setPage: (newPage: number) => void;
  setPerPages?: (perPage: number) => void;
  perPage?: number;
}> = ({ page, totalPages, setPage, setPerPages, perPage }) => {
  const decrementPage = () => {
    setPage(page - 1);
  };

  const incrementPage = () => {
    setPage(page + 1);
  };

  const handleSetPerPages = (event: ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setPerPages!(parseInt(event.currentTarget.value) ?? 5);
  };

  return (
    <div className="w-full flex justify-end mt-4 items-center gap-x-20 bg-secondary/20 rounded-lg p-2 text-base-content text-sm">
      <PaginationSelect
        handleSetPerPages={handleSetPerPages}
        perPage={perPage}
      />
      <p>
        {page} of {totalPages}
      </p>
      <div className="btn-group gap-x-4">
        <button
          className="border-none bg-secondary/50 btn btn-sm"
          disabled={page === 1}
          onClick={decrementPage}
        >
          {"<"}
        </button>
        <button
          className="border-none bg-secondary/50 btn btn-sm"
          disabled={page === totalPages}
          onClick={incrementPage}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
