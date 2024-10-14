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

  const goToFistPage = () => {
    setPage(1);
  };

  const goToLastPage = () => {
    setPage(totalPages!);
  };

  const handleSetPerPages = (event: ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setPerPages!(parseInt(event.currentTarget.value) ?? 5);
  };

  return (
    <div className="w-full flex justify-end mt-4 items-center gap-x-20 bg-transparent rounded-lg p-2 text-base-content text-sm">
      <PaginationSelect
        handleSetPerPages={handleSetPerPages}
        perPage={perPage}
      />
      <p>
        Page {page} sur {totalPages}
      </p>
      {totalPages && totalPages > 1 ? (
        <div className="btn-group gap-x-4">
          <button
            className="btn btn-primary btn-sm"
            onClick={goToFistPage}
            disabled={page === 1}
            aria-label="afficher la première page"
          >
            {"<<"}
          </button>
          <button
            className="btn-primary btn btn-sm"
            disabled={page === 1}
            onClick={decrementPage}
            aria-label="afficher la page précédente"
          >
            {"<"}
          </button>
          <button
            className="btn-primary btn btn-sm"
            disabled={page === totalPages}
            onClick={incrementPage}
            aria-label="afficher la page suivante"
          >
            {">"}
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={goToLastPage}
            disabled={page === totalPages}
            aria-label="afficher la dernière page"
          >
            {">>"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Pagination;
