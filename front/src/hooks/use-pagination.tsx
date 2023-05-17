import { useCallback, useState } from "react";

import { perPage } from "../config/pagination";
import useHttp from "./use-http";

const initialState = {
  page: 1,
  perPage: perPage,
  total: null,
  totalPages: null,
};

const usePagination = (value: string) => {
  const [sdir, setSdir] = useState(false);
  const [stype, setStype] = useState(value);
  const [page, handlePage] = useState(initialState.page);
  const [perPage] = useState(initialState.perPage);
  const [totalPages, handleTotalPages] = useState<number | null>(
    initialState.totalPages
  );
  const [dataList, setDataList] = useState<Array<any>>([]);
  const { sendRequest } = useHttp();

  const setPage = useCallback((value: number) => {
    handlePage(value);
  }, []);

  const initPagination = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const setTotalPages = useCallback(
    (total: number) => {
      handleTotalPages(Math.ceil(total! / perPage));
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

  const getList = useCallback(
    (roleName: string) => {
      const applyData = (data: { list: Array<any>; total: number }) => {
        let index = (page - 1) * perPage + 1;
        data.list.forEach((item: any) => {
          item.index = index++ + ".";
          item.createdAt =
            item?.createdAt && new Date(item.createdAt).toLocaleDateString();
          item.updatedAt =
            item?.updatedAt && new Date(item.updatedAt).toLocaleDateString();
          item.isSelected = false;
        });
        setTotalPages(data.total);
        setDataList(data.list);
      };
      sendRequest(
        {
          path: `/user/${roleName}/${stype}/${
            sdir ? "desc" : "asc"
          }?page=${page}&limit=${perPage}`,
        },
        applyData
      );
    },
    [sendRequest, page, perPage, setTotalPages, stype, sdir]
  );

  return {
    page: page,
    perPage: perPage,
    totalPages: totalPages,
    sdir,
    stype,
    dataList,
    setPage,
    initPagination,
    setTotalPages,
    reset: initPagination,
    sortData,
    setStype,
    getList,
    setDataList,
  };
};

export default usePagination;
