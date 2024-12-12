import { useMemo } from "react";

type Props = {
  page: number;
  perPage: number;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
  totalPages: number;
};

function Pagination({ page, perPage, totalPages, setLimit, setPage }: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
  };

  const canPrevious = useMemo(() => {
    return page > 1;
  }, [page]);

  const canNext = useMemo(() => {
    return page < totalPages;
  }, [page, totalPages]);

  return (
    <div className="flex justify-center items-center gap-x-4">
      Nombre d'éléments par page
      <select
        className="select select-bordered select-sm focus:outline-none"
        onChange={handleChange}
      >
        <option>10</option>
        <option>20</option>
        <option>30</option>
      </select>
      <button
        className="btn btn-sm btn-circle btn-primary"
        disabled={!canPrevious}
      >
        {"<"}
      </button>
      <p>
        Page {page} de {totalPages}
      </p>
      <button
        className="btn btn-sm  btn-circle btn-primary"
        disabled={!canNext}
      >
        {">"}
      </button>
    </div>
  );
}

export default Pagination;
