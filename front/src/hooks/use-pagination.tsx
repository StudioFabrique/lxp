import { useCallback, useEffect, useState } from "react";

import { perPage } from "../config/pagination";
import useHttp from "./use-http";

const initialState = {
  page: 1,
  perPage: perPage,
  totalPages: null,
};

const usePagination = (defaultSortValue: string, defaultUrlPath: string) => {
  const [sdir, setSdir] = useState(false);
  const [stype, setStype] = useState(defaultSortValue);
  const [page, setPage] = useState(initialState.page);
  const [perPage] = useState(initialState.perPage);
  const [totalPages, setTotalPages] = useState<number | null>(
    initialState.totalPages
  );
  const [dataList, setDataList] = useState<Array<any>>([]);
  const [path, setPath] = useState(defaultUrlPath);
  const { sendRequest } = useHttp();

  const handlePageNumber = useCallback((value: number) => {
    setPage(value);
  }, []);

  const initPagination = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const handleTotalPages = useCallback(
    (total: number) => {
      setTotalPages(Math.ceil(total! / perPage));
    },
    [perPage]
  );

  const sortData = (column: string) => {
    if (column !== stype) {
      setSdir(false);
    } else {
      setSdir((prevSdir) => {
        return !prevSdir;
      });
    }
    setStype(column);
    initPagination();
  };

  const getList = useCallback(() => {
    const applyData = (data: { list: Array<any>; total: number }) => {
      data.list.forEach((item: any) => {
        item.createdAt =
          item?.createdAt && new Date(item.createdAt).toLocaleDateString();
        item.updatedAt =
          item?.updatedAt && new Date(item.updatedAt).toLocaleDateString();
        item.isSelected = false;
      });
      handleTotalPages(data.total);
      setDataList(data.list);
    };

    sendRequest(
      {
        path: `${path}/${stype}/${
          sdir ? "desc" : "asc"
        }?page=${page}&limit=${perPage}`,
      },
      applyData
    );
  }, [sendRequest, page, perPage, handleTotalPages, stype, sdir, path]);

  useEffect(() => {
    getList();
  }, [path, getList]);

  return {
    page: page,
    perPage: perPage,
    totalPages: totalPages,
    sdir,
    stype,
    dataList,
    handlePageNumber,
    initPagination,
    handleTotalPages,
    reset: initPagination,
    sortData,
    setStype,
    getList,
    setDataList,
    setPath,
  };
};

export default usePagination;
