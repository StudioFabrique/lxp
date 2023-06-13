import React, { FC } from "react";

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
    console.log("click ok");

    setPage(page + 1);
  };

  // handlePerPages = (event: ) => {
  //   setPerPages
  // }

  return (
    <div className="w-full flex justify-end mt-4 items-center gap-x-10 bg-secondary rounded-lg p-2 text-secondary-content text-sm">
      <p>row per pages :</p>
      <select className="select select-sm bg-secondary">
        <option>5</option>
        <option>10</option>
        <option>15</option>
      </select>
      <p>
        {page} of {totalPages}
      </p>
      <div className="btn-group gap-x-4">
        <button
          className="border-none bg-secondary btn btn-sm"
          disabled={page === 1}
          onClick={decrementPage}
        >
          {"<"}
        </button>
        <button
          className="border-none bg-secondary btn btn-sm"
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
