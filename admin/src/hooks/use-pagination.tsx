import { useCallback, useReducer } from "react";
import { perPage } from "../config/pagination";

const initialState = {
  page: 1,
  perPage: perPage,
  total: null,
  totalPages: null,
};

const setTotalPages = (total: number, perPage: number) => {
  return Math.ceil(total / perPage);
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
        total: action.value,
        totalPages: setTotalPages(action.value, state.perPage),
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

  const initPagination = useCallback(() => {
    dispatch({ type: "INIT" });
  }, []);

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
