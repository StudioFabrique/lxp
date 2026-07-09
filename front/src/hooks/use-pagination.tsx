/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import apiClient from "../lib/axios";
import { rowsPerPage } from "../config/pagination";
import toast from "react-hot-toast";

const initialState = {
  page: 1,
  perPage: rowsPerPage,
  totalPages: null,
};

const usePagination = (defaultSortValue: string, defaultUrlPath: string) => {
  const [sdir, setSdir] = useState(false);
  const [stype, setStype] = useState(defaultSortValue);
  const [page, setPage] = useState(initialState.page);
  const [perPage, setPerPage] = useState(initialState.perPage);
  const [totalPages, setTotalPages] = useState<number | null>(
    initialState.totalPages,
  );
  const [dataList, setDataList] = useState<Array<any>>([]);
  const [path, setPath] = useState(defaultUrlPath);
  const [allChecked, setAllChecked] = useState(false);
  const [urlComplement, setUrlComplement] = useState<string | null>(null);

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
    [perPage],
  );

  const handleRowCheck = (id: string) => {
    setDataList((prevDataList: any) =>
      prevDataList.map((item: any) =>
        item._id === id ? { ...item, isSelected: !item.isSelected } : item,
      ),
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

  const resetList = useCallback(() => {
    setDataList([]);
  }, []);

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
      if (path !== defaultUrlPath) {
        setPath(defaultUrlPath);
      }
    };

    apiClient
      .get(
        `${path}/${stype}/${
          sdir ? "desc" : "asc"
        }?page=${page}&limit=${perPage}${urlComplement ? urlComplement : ""}`,
      )
      .then((response) => applyData(response.data))
      .catch(() => {});
  }, [
    page,
    perPage,
    handleTotalPages,
    stype,
    sdir,
    path,
    urlComplement,
    defaultUrlPath,
  ]);

  const uncheckAll = () => {
    setDataList((prevDataList) => {
      if (prevDataList) {
        return prevDataList.map((data: any) => ({
          ...data,
          isSelected: false,
        }));
      }
      return dataList;
    });
  };

  /**
  retourne les identifiants des objets sélectionnés via les checkboxes
  */
  const getSelectedIds = (): string[] => {
    const ids = dataList.map((item) => {
      if (item.isSelected) return item._id;
    });
    return ids;
  };

  const sendInvitation = (userId: string) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        getList();
      }
    };
    apiClient
      .put(`/user/invitation/${userId}`)
      .then((response) => applyData(response.data))
      .catch(() => {});
  };

  const handleSearch = (searchTerm: string) => {
    setUrlComplement(searchTerm.length > 0 ? `&searchTerm=${searchTerm}` : "");
  };

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
    allChecked,
    dataList,
    getList,
    getSelectedIds,
    handlePageNumber,
    handleRowCheck,
    handleSearch,
    handleTotalPages,
    initPagination,
    page,
    perPage,
    reset: initPagination,
    resetList,
    sendInvitation,
    setAllChecked,
    setDataList,
    setPage,
    setPerPage,
    setPath,
    setStype,
    sdir,
    sortData,
    stype,
    totalPages,
    uncheckAll,
  };
};

export default usePagination;
