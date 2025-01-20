/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { getPagination } from "../utils/get-pagination";
import { sortArray } from "../utils/sortArray";

/**
 * Hook personnalisé pour gérer une liste avec chargement immédiat, pagination, tri et sélection
 * @param initialList - Liste initiale des éléments à afficher
 * @param defaultSort - Champ de tri par défaut
 * @param defaultLimit - Nombre d'éléments par page (défaut: 15)
 * @param idProperty - Propriété utilisée comme identifiant unique ('id' ou '_id')
 */
const useEagerLoadingList = (
  initialList: Array<any>,
  defaultSort: string,
  defaultLimit = 15,
  idProperty: "id" | "_id" = "id"
) => {
  // États pour gérer la liste et ses propriétés
  const [list, setList] = useState<Array<any> | null>(initialList); // Liste temporaire des objets à afficher
  const [page, setPage] = useState(1); // Numéro de la page courante
  const [limit, setLimit] = useState(defaultLimit); // Nombre d'éléments par page
  const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
  const [allChecked, setAllChecked] = useState(false); // État de sélection globale
  const [fieldSort, setFieldSort] = useState<string>(defaultSort); // Champ de tri actuel
  const [direction, setDirection] = useState<boolean>(true); // Direction du tri (true = ascendant)

  /**
   * Gère la sélection/désélection d'un élément individuel
   * @param id - Identifiant de l'élément à basculer
   */
  const handleRowCheck = (id: any) => {
    setList((prevList: any) =>
      prevList.map((item: any) =>
        item[idProperty] === id
          ? { ...item, isSelected: !item.isSelected }
          : item
      )
    );
  };

  /**
   * Retourne la liste des éléments sélectionnés
   * @returns Array des éléments avec isSelected = true
   */
  const getSelecteditems = () => {
    return list?.filter((item: any) => item.isSelected);
  };

  /**
   * Filtre la liste selon les critères spécifiés
   * @param filters - Objet contenant les critères de filtrage
   */
  const getFilteredList = useCallback(
    (filters: { field: string; property: string; value: string }) => {
      let filteredList = initialList;

      if (filters.property.length > 0) {
        filteredList = filteredList.filter((item: any) =>
          item[filters.field][filters.property]
            .toLowerCase()
            .includes(filters.value)
        );
      } else {
        filteredList = filteredList.filter((item: any) =>
          item[filters.field].toLowerCase().includes(filters.value)
        );
      }

      setList(filteredList);
    },
    [initialList]
  );

  /**
   * Extrait les valeurs uniques pour un champ donné
   * @param field - Nom du champ pour lequel extraire les valeurs
   * @returns Array des valeurs uniques
   */
  const getFieldValues = useCallback(
    (field: string) => {
      const values = Array<string>();
      initialList?.forEach((item: any) => {
        if (!values.includes(item[field])) {
          values.push(item[field]);
        }
      });
      return values;
    },
    [initialList]
  );

  /**
   * Réinitialise les filtres et la sélection
   */
  const resetFilters = useCallback(() => {
    setAllChecked(false);
    setList(initialList);
  }, [initialList]);

  /**
   * Gère le tri des données
   * @param column - Colonne sur laquelle effectuer le tri
   */
  const sortData = (column: string) => {
    if (column === fieldSort) {
      setDirection((prevDirection) => !prevDirection);
    } else {
      setFieldSort(column);
      setDirection(true);
    }
  };

  // Effect pour le tri des données
  useEffect(() => {
    setList((prevList: any) => {
      if (prevList && prevList.length !== 0) {
        return sortArray(prevList, fieldSort, direction);
      } else {
        return null;
      }
    });
  }, [fieldSort, direction]);

  // Effect pour la pagination
  useEffect(() => {
    setAllChecked(false);
    const offset = getPagination(page, limit);
    setList(initialList.slice(offset, offset + limit));
  }, [initialList, limit, page]);

  // Effect pour calculer le nombre total de pages
  useEffect(() => {
    const pages =
      initialList.length % limit === 0
        ? initialList.length / limit
        : Math.trunc(initialList.length / limit) + 1;
    setTotalPages(pages);
  }, [limit, initialList]);

  // Effect pour la sélection globale
  useEffect(() => {
    setList((prevList: any) =>
      prevList.map((item: any) => ({ ...item, isSelected: allChecked }))
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
