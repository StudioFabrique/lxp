import { useCallback, useReducer } from "react";

const initialState = {
  page: 1,
  perPage: 10,
  total: null,
  totalPages: null,
};

const pageReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_PAGE":
      return {
        ...state,
        page: action.value,
      };

    case "SET_TOTAL_PAGES":
      return {
        ...state,
        totalPages: action.value,
      };

    case "INIT":
      return {
        ...state,
        page: 1,
      };
    default:
      return state;
  }
};

const usePagination = () => {
  const [state, dispatch] = useReducer(pageReducer, initialState);

  const initPagination = () => {
    dispatch({ type: "INIT" });
  };

  const setPage = useCallback((value: number) => {
    console.log("page changée");

    dispatch({ type: "SET_PAGE", value });
  }, []);

  const setTotalPages = useCallback((value: number) => {
    dispatch({ type: "SET_TOTAL_PAGES", value });
  }, []);

  return {
    page: state.page,
    perPage: state.perPage,
    total: state.total,
    totalPages: state.totalPages,
    setPage,
    initPagination,
    setTotalPages,
    reset: initPagination,
  };
};

export default usePagination;
