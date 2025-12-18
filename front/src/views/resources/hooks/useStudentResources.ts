import usePagination from "../../../hooks/use-pagination";

const useStudentResources = () => {
  const { page, totalPages, dataList, setPerPage, setPage, perPage } =
    usePagination("title", "/resources");

  return {
    page,
    totalPages,
    dataList,
    setPage,
    perPage,
    setPerPage,
  };
};
export default useStudentResources;
