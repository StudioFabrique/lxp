import usePagination from "../../../hooks/use-pagination";

export type ResourceListItem = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
};

const useResources = () => {
  const {
    page,
    totalPages,
    dataList,
    stype,
    sdir,
    getList,
    sortData,
    initPagination,
    handlePageNumber,
    setDataList,
    setPerPage,
    setPage,
    perPage,
  } = usePagination("title", "/resources");

  return {
    page,
    totalPages,
    dataList,
    stype,
    sdir,
    getList,
    sortData,
    initPagination,
    handlePageNumber,
    setDataList,
    setPerPage,
    setPage,
    perPage,
  };
};

export default useResources;
