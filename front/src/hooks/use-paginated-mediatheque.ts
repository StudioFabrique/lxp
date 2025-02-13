// Hook personnalisé pour gérer la pagination des médias (images et documents)
// Utilise useReducer pour gérer l'état de la pagination

import { useCallback, useEffect, useReducer } from "react";

import useHttp from "./use-http";
import toast from "react-hot-toast";

// Interface définissant la structure de l'état de pagination
type PaginationState<T> = {
  page: number; // Page courante
  perPage: number; // Nombre d'éléments par page
  totalPages: number; // Nombre total de pages
  list: T[]; // Liste des éléments de la page courante
  type: "image" | "video" | "audio" | "resource"; // Type de média à afficher
};

// État initial de la pagination
const initialState = {
  page: 1,
  perPage: 6,
  totalPages: 0,
  list: [],
  type: "image",
};

// Types d'actions possibles pour le reducer
type PaginationAction<T> =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_LIST"; payload: { list: T[]; totalPages: number } }
  | { type: "SET_TYPE"; payload: "image" | "video" | "audio" | "resource" };

// Reducer pour gérer les différentes actions de pagination
const paginationReducer = <T>(
  state: PaginationState<T>,
  action: PaginationAction<T>
): PaginationState<T> => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };

    case "SET_LIMIT":
      // Retour à la première page lors du changement de limite
      return { ...state, page: 1, perPage: action.payload };

    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };

    case "SET_LIST":
      // Mise à jour de la liste et retour à la première page
      return {
        ...state,
        list: action.payload.list,
        totalPages: action.payload.totalPages,
      };

    case "SET_TYPE":
      // Changement du type de média et retour à la première page
      return { ...state, page: 1, type: action.payload };

    default:
      return state;
  }
};

// Hook principal de pagination
const usePaginatedMediatheque = <T>() => {
  const { error, isLoading, sendRequest } = useHttp();
  const [state, dispatch] = useReducer(
    paginationReducer,
    initialState as PaginationState<T>
  );

  // Fonctions de mise à jour de l'état mémorisées avec useCallback
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

  // Fonction pour récupérer la liste paginée depuis l'API
  const getPaginatedList = useCallback(() => {
    const applyData = (data: { medias: T[]; totalPages: number }) => {
      setList(data.medias, data.totalPages);
    };
    sendRequest(
      {
        path: `/media?page=${state.page}&limit=${state.perPage}&type=${state.type}`,
      },
      applyData
    );
  }, [sendRequest, setList, state.page, state.perPage, state.type]);

  // Effet pour charger la liste à chaque changement des dépendances
  useEffect(() => {
    getPaginatedList();
  }, [getPaginatedList]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  // Retourne les valeurs et fonctions nécessaires pour utiliser la pagination
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
    totalPages: state.totalPages,
    type: state.type,
  };
};

export default usePaginatedMediatheque;
