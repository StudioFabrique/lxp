import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

import PaginationSelect from "./pagination-select.component";

const Pagination: FC<{
  page: number;
  totalPages: number | null;
  setPage: (value: number) => void;
  setPerPages?: Dispatch<SetStateAction<number>>;
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
    <div className="flex-col md:flex-row gap-2 flex justify-end mt-4 items-center gap-x-4 bg-transparent rounded-lg px-8 py-4 text-base-content text-sm border border-primary/20">
      <span className="flex gap-2 items-center">
        <PaginationSelect
          handleSetPerPages={handleSetPerPages}
          perPage={perPage}
        />
        <p>
          Page {page} sur {totalPages}
        </p>
      </span>
      {totalPages && totalPages > 1 ? (
        <div className="btn-group flex gap-x-4">
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
