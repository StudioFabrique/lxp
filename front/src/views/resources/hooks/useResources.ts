import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";

export type ResourceListItem = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
};

const useResources = () => {
  const [resourcesList, setResourcesList] = useState<ResourceListItem[]>([]);
  const { sendRequest, isLoading } = useHttp();

  const {
    allChecked,
    page,
    totalPages,
    dataList,
    stype,
    sdir,
    getList,
    sortData,
    initPagination,
    handlePageNumber,
    setPath,
    handleRowCheck,
    setAllChecked,
    setDataList,
    sendInvitation,
  } = usePagination("title", "/resources");

  

export default useResources;
