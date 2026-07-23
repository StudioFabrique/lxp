import { useCallback, useEffect, useState } from "react";
import { getPagination } from "./get-pagination";
import { sortArray } from "../utils/helpers/sort-array";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useEagerLoadingList = (initialList: Array<any>, defaultSort: string, defaultLimit = 15, idProperty: "id" | "_id" = "id") => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [list, setList] = useState<Array<any> | null>(initialList);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [totalPages, setTotalPages] = useState(0);
  const [allChecked, setAllChecked] = useState(false);
  const [fieldSort, setFieldSort] = useState<string>(defaultSort);
  const [direction, setDirection] = useState<boolean>(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRowCheck = (id: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setList((prevList: any) =>
      prevList
        ? prevList.map((item: any) =>
          item[idProperty] === id
            ? { ...item, isSelected: !item.isSelected }
            : item,
        )
        : null,
    );
  };

  const getSelecteditems = () => {
    return list?.filter((item) => item.isSelected);
  };

  const getFilteredList = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (filters: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredList = initialList.filter((item: any) => {
        if (filters.property.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (item as any)[filters.field][filters.property]
            .toLowerCase()
            .includes(filters.value);
        }
        return item[filters.field].toLowerCase().includes(filters.value);
      });

      setList(filteredList);
    },
    [initialList],
  );

  const getFieldValues = useCallback(
    (field: string) => {
      const values = Array<string>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialList?.forEach((item: any) => {
        if (!values.includes(item[field])) {
          values.push(item[field]);
        }
      });
      return values;
    },
    [initialList],
  );

  const resetFilters = useCallback(() => {
    setAllChecked(false);
    setList(initialList);
  }, [initialList]);

  const sortData = (column: string) => {
    if (column === fieldSort) {
      setDirection((prevDirection) => !prevDirection);
    } else {
      setFieldSort(column);
      setDirection(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setList((prevList: any) => {
      if (prevList && prevList.length !== 0) {
        return sortArray(prevList, fieldSort, direction);
      }
      return null;
    });
  }, [fieldSort, direction]);

  useEffect(() => {
    setAllChecked(false);
    const offset = getPagination(page, limit);
    setList(initialList.slice(offset, offset + limit));
  }, [initialList, limit, page]);

  useEffect(() => {
    const pages =
      initialList.length % limit === 0
        ? initialList.length / limit
        : Math.trunc(initialList.length / limit) + 1;
    setTotalPages(pages);
  }, [limit, initialList]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setList((prevList: any) =>
      prevList
        ? prevList.map((item: any) => ({ ...item, isSelected: allChecked }))
        : null,
    );
  }, [allChecked]);

  return {
    allChecked,
    direction,
    fieldSort,
    list,
    page,
    totalPages,
    setAllChecked,
    setPage,
    setLimit,
    handleRowCheck,
    getSelecteditems,
    getFilteredList,
    getFieldValues,
    resetFilters,
    sortData,
  };
};

export default useEagerLoadingList;
