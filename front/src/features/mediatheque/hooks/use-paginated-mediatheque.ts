/**
 * Hook personnalisé pour gérer la pagination des médias (images, vidéos, audios et ressources)
 * Utilise useReducer pour gérer l'état de la pagination de manière efficace
 * Permet de gérer le chargement, le tri et le filtrage des médias par type
 */

import { useCallback, useEffect, useReducer, useState } from "react";
import { mediathequeApi } from "../api/mediatheque.api";
import toast from "react-hot-toast";

/**
 * Interface définissant la structure de l'état de pagination
 * @template T Type générique représentant le type des éléments de la liste
 */
type PaginationState<T> = {
  page: number;
  perPage: number;
  totalPages: number;
  list: T[];
  type: "image" | "video" | "audio" | "resource";
  sort: "createdAt" | "size" | "used" | "name";
};

/**
 * État initial de la pagination avec les valeurs par défaut
 */
const initialState = {
  page: 1,
  perPage: 6,
  totalPages: 0,
  list: [],
  type: "image",
  sort: "createdAt",
};

/**
 * Types d'actions possibles pour le reducer
 */
type PaginationAction<T> =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_LIST"; payload: { list: T[]; totalPages: number } }
  | { type: "SET_TYPE"; payload: "image" | "video" | "audio" | "resource" }
  | { type: "SET_SORT"; payload: "createdAt" | "size" | "used" | "name" };

/**
 * Reducer qui gère les différentes actions de pagination
 */
const paginationReducer = <T>(
  state: PaginationState<T>,
  action: PaginationAction<T>
): PaginationState<T> => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_LIMIT":
      return { ...state, page: 1, perPage: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_LIST":
      return {
        ...state,
        list: action.payload.list,
        totalPages: action.payload.totalPages,
      };
    case "SET_TYPE":
      return { ...state, page: 1, type: action.payload };
    case "SET_SORT":
      return { ...state, page: 1, sort: action.payload };
    default:
      return state;
  }
};

/**
 * Hook principal qui gère la pagination des médias
 */
const usePaginatedMediatheque = <T>() => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(
    paginationReducer,
    initialState as PaginationState<T>
  );

  const setPage = useCallback((page: number) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const setLimit = useCallback((limit: number) => {
    dispatch({ type: "SET_LIMIT", payload: limit });
  }, []);

  const setTotalPages = useCallback((totalPages: number) => {
    dispatch({ type: "SET_TOTAL_PAGES", payload: totalPages });
  }, []);

  const setList = useCallback((list: T[], totalPages: number) => {
    dispatch({
      type: "SET_LIST",
      payload: { list, totalPages },
    });
  }, []);

  const setType = useCallback(
    (type: "image" | "video" | "audio" | "resource") => {
      dispatch({ type: "SET_TYPE", payload: type });
    },
    []
  );

  const setSort = useCallback(
    (sort: "createdAt" | "size" | "used" | "name") => {
      dispatch({ type: "SET_SORT", payload: sort });
    },
    []
  );

  const getPaginatedList = useCallback(() => {
    const applyData = (data: { medias: T[]; totalPages: number }) => {
      setList(data.medias, data.totalPages);
    };
    setIsLoading(true);
    setError("");
    mediathequeApi.queries
      .getPaginated<T>({
        page: state.page,
        limit: state.perPage,
        type: state.type,
        sort: state.sort,
      })
      .then(applyData)
      .catch((err) => {
        const errorMessage =
          err?.response?.data?.message ?? "Erreur inconnue";
        setError(errorMessage);
      })
      .finally(() => setIsLoading(false));
  }, [setList, state.page, state.perPage, state.sort, state.type]);

  useEffect(() => {
    getPaginatedList();
  }, [getPaginatedList]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return {
    isLoading,
    list: state.list,
    page: state.page,
    perPage: state.perPage,
    setLimit,
    setList,
    setPage,
    setTotalPages,
    setType,
    setSort,
    totalPages: state.totalPages,
    type: state.type,
  };
};

export default usePaginatedMediatheque;
