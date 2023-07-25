import { useCallback, useEffect, useState } from "react";

import useHttp from "./use-http";
import { rowsPerPage } from "../config/pagination";

const initialState = {
  page: 1,
  perPage: rowsPerPage,
  totalPages: null,
};

const usePagination = (defaultSortValue: string, defaultUrlPath: string) => {
  const [sdir, setSdir] = useState(false);
  const [stype, setStype] = useState(defaultSortValue ?? "desc");
  const [page, setPage] = useState(initialState.page);
  const [perPage, setPerPage] = useState(initialState.perPage);
  const [totalPages, setTotalPages] = useState<number | null>(
    initialState.totalPages
  );
  const [dataList, setDataList] = useState<Array<any>>([]);
  const [path, setPath] = useState(defaultUrlPath);
  const { sendRequest } = useHttp();
  const [allChecked, setAllChecked] = useState(false);

  const handlePageNumber = useCallback((value: number) => {
    setPage(value);
  }, []);

  const initPagination = useCallback(() => {
    setPage(1);
  }, []);

  const handleTotalPages = useCallback(
    (total: number) => {
      setTotalPages(Math.ceil(total! / perPage));
    },
    [perPage]
  );

  const handleRowCheck = (id: string) => {
    setDataList((prevDataList: any) =>
      prevDataList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

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
    console.log("update des données des users en cours...");

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
      console.log("update des données effectué");
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

  useEffect(() => {
    setDataList((prevDataList: any) => {
      if (prevDataList) {
        return prevDataList.map((item: any) => {
          item.isSelected = allChecked;
          return item;
        });
      }
      return prevDataList;
    });
  }, [allChecked]);

  return {
    page: page,
    perPage: perPage,
    totalPages: totalPages,
    sdir,
    stype,
    dataList,
    allChecked,
    handlePageNumber,
    initPagination,
    handleTotalPages,
    reset: initPagination,
    sortData,
    setStype,
    getList,
    setDataList,
    setPath,
    setAllChecked,
    handleRowCheck,
    setPerPage,
  };
};

export default usePagination;
