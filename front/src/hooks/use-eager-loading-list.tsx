/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { getPagination } from "../utils/get-pagination";
import { sortArray } from "../utils/sortArray";

const useEagerLoadingList = (
  initialList: Array<any>,
  defaultSort: string,
  defaultLimit = 15,
  idProperty: "id" | "_id" = "id",
) => {
  const [list, setList] = useState<Array<any> | null>(initialList); // liste temporaire des objets à afficher
  const [page, setPage] = useState(1); //  numéro de la page affichée
  const [limit, setLimit] = useState(defaultLimit); // quantité d'objets à afficher
  const [totalPages, setTotalPages] = useState(0);
  const [allChecked, setAllChecked] = useState(false);
  const [fieldSort, setFieldSort] = useState<string>(defaultSort);
  const [direction, setDirection] = useState<boolean>(true);

  /**
   * gère le cochage décochage d'une row individuelle
   * @param id number
   */
  const handleRowCheck = (id: any) => {
    setList((prevList: any) =>
      prevList.map((item: any) =>
        item[idProperty] === id
          ? { ...item, isSelected: !item.isSelected }
          : item,
      ),
    );
  };

  /**
   * retourne la liste des objets qui ont la propriété isSelected égale à true
   * @returns Array<any>
   */
  const getSelecteditems = () => {
    return list?.filter((item: any) => item.isSelected);
  };

  /**
   * filtre la liste d'objets, ici "property" est utilisée dans le
   * cas ou la propriété du champà recherche ne soir pas une chaîne
   * de caractères mais pas exemple un booleen
   */
  const getFilteredList = useCallback(
    (filters: { field: string; property: string; value: string }) => {
      let filteredList = initialList;

      if (filters.property.length > 0) {
        filteredList = filteredList.filter((item: any) =>
          item[filters.field][filters.property]
            .toLowerCase()
            .includes(filters.value),
        );
      } else {
        filteredList = filteredList.filter((item: any) =>
          item[filters.field].toLowerCase().includes(filters.value),
        );
      }

      setList(filteredList);
    },
    [initialList],
  );

  /**
   * extraction des différentes valeurs de la liste d'objets par propriété
   */
  const getFieldValues = useCallback(
    (field: string) => {
      const values = Array<string>();
      initialList?.forEach((item: any) => {
        // si la valeur n'est pas déja présente dans le tableau on l'y ajoute
        if (!values.includes(item[field])) {
          values.push(item[field]);
        }
      });
      return values;
    },
    [initialList],
  );

  /**
   * réinitialise le state "list" avec la valeur de "initialList" et uncheck toutes les checkboxes de la liste
   */
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

  /**
   * tri les colonnes du tableau quand l'utilisateur clique sur le nom d'une colonne
   */
  useEffect(() => {
    setList((prevList: any) => {
      if (prevList && prevList.length !== 0) {
        return sortArray(prevList, fieldSort, direction);
      } else {
        return null;
      }
    });
  }, [fieldSort, direction]);

  /**
   * modifie le contenu de la liste des objets à afficher en fonction des action de l'utlisateur (changement de page)
   */
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

  /**
   * gère le cochage / décochage de toutes les rows de la liste
   */
  useEffect(() => {
    setList((prevList: any) =>
      prevList.map((item: any) => ({ ...item, isSelected: allChecked })),
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
