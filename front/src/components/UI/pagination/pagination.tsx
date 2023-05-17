import React, { FC } from "react";

const Pagination: FC<{
  page: number;
  totalPages: number | null;
  setPage: (newPage: number) => void;
  setPerPages?: (perPage: number) => void;
}> = ({ page, totalPages, setPage, setPerPages }) => {
  const decrementPage = () => {
    setPage(page - 1);
  };

  const incrementPage = () => {
    console.log("click ok");

    setPage(page + 1);
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="btn-group">
        <button
          className="text-primary border-none bg-secondary btn"
          disabled={page === 1}
          onClick={decrementPage}
        >
          «
        </button>
        <div className="bg-base-100 border-none text-primary btn">
          {page} / {totalPages}
        </div>
        <button
          className="text-primary border-none bg-secondary btn"
          disabled={page === totalPages}
          onClick={incrementPage}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
