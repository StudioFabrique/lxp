/**
 * Hook personnalisé pour gérer la pagination des médias (images, vidéos, audios et ressources)
 * Utilise useReducer pour gérer l'état de la pagination de manière efficace
 * Permet de gérer le chargement, le tri et le filtrage des médias par type
 */

import { useCallback, useEffect, useReducer } from "react";
import useHttp from "./use-http";
import toast from "react-hot-toast";

/**
 * Interface définissant la structure de l'état de pagination
 * @template T Type générique représentant le type des éléments de la liste
 */
type PaginationState<T> = {
  page: number; // Numéro de la page courante
  perPage: number; // Nombre d'éléments affichés par page
  totalPages: number; // Nombre total de pages disponibles
  list: T[]; // Liste des éléments de la page courante
  type: "image" | "video" | "audio" | "resource"; // Type de média à afficher
  sort: "createdAt" | "size" | "used"; // Critère de tri des médias
};

/**
 * État initial de la pagination avec les valeurs par défaut
 */
const initialState = {
  page: 1,
  perPage: 6, // Affiche 6 éléments par page par défaut
  totalPages: 0,
  list: [],
  type: "image", // Type par défaut : image
  sort: "createdAt", // Tri par défaut : date de création
};

/**
 * Types d'actions possibles pour le reducer
 * Définit toutes les modifications possibles de l'état
 */
type PaginationAction<T> =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_LIST"; payload: { list: T[]; totalPages: number } }
  | { type: "SET_TYPE"; payload: "image" | "video" | "audio" | "resource" }
  | { type: "SET_SORT"; payload: "createdAt" | "size" | "used" };

/**
 * Reducer qui gère les différentes actions de pagination
 * @template T Type générique des éléments de la liste
 */
const paginationReducer = <T>(
  state: PaginationState<T>,
  action: PaginationAction<T>
): PaginationState<T> => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_LIMIT":
      return { ...state, page: 1, perPage: action.payload }; // Reset à la page 1
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_LIST":
      return {
        ...state,
        list: action.payload.list,
        totalPages: action.payload.totalPages,
      };
    case "SET_TYPE":
      return { ...state, page: 1, type: action.payload }; // Reset à la page 1
    case "SET_SORT":
      return { ...state, page: 1, sort: action.payload }; // Reset à la page 1
    default:
      return state;
  }
};

/**
 * Hook principal qui gère la pagination des médias
 * @template T Type générique des éléments de la liste
 */
const usePaginatedMediatheque = <T>() => {
  const { error, isLoading, sendRequest } = useHttp();
  const [state, dispatch] = useReducer(
    paginationReducer,
    initialState as PaginationState<T>
  );

  // Fonctions mémorisées pour mettre à jour l'état
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

  const setSort = useCallback((sort: "createdAt" | "size" | "used") => {
    dispatch({ type: "SET_SORT", payload: sort });
  }, []);

  /**
   * Fonction qui récupère la liste paginée depuis l'API
   * Construit l'URL avec les paramètres de pagination actuels
   */
  const getPaginatedList = useCallback(() => {
    const applyData = (data: { medias: T[]; totalPages: number }) => {
      setList(data.medias, data.totalPages);
    };
    sendRequest(
      {
        path: `/media?page=${state.page}&limit=${state.perPage}&type=${state.type}&sort=${state.sort}`,
      },
      applyData
    );
  }, [sendRequest, setList, state.page, state.perPage, state.sort, state.type]);

  // Charge la liste quand les paramètres de pagination changent
  useEffect(() => {
    getPaginatedList();
  }, [getPaginatedList]);

  // Affiche les erreurs avec toast
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  // Expose les valeurs et fonctions nécessaires
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
