// Hook personnalisé pour gérer la pagination des médias (images et documents)
// Utilise useReducer pour gérer l'état de la pagination

import { useCallback, useEffect, useReducer } from "react";

import useHttp from "./use-http";

// Interface définissant la structure de l'état de pagination
type PaginationState<T> = {
  page: number; // Page courante
  perPage: number; // Nombre d'éléments par page
  totalPages: number; // Nombre total de pages
  list: T[]; // Liste des éléments de la page courante
  type: "image" | "document"; // Type de média à afficher
};

// État initial de la pagination
const initialState = {
  page: 1,
  perPage: 10,
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
  | { type: "SET_TYPE"; payload: "image" | "document" };

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
  const { sendRequest } = useHttp();
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

  const setType = useCallback((type: "image" | "document") => {
    dispatch({ type: "SET_TYPE", payload: type });
  }, []);

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

  // Retourne les valeurs et fonctions nécessaires pour utiliser la pagination
  return {
    list: state.list,
    page: state.page,
    perPage: state.perPage,
    totalPages: state.totalPages,
    setPage,
    setLimit,
    setTotalPages,
    setList,
    setType,
  };
};

export default usePaginatedMediatheque;
