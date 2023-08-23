import { useCallback, useEffect, useState } from "react";
import { getPagination } from "../utils/get-pagination";
import { sortArray } from "../utils/sortArray";

const useEagerLoadingList = (initialList: Array<any>, defaultSort: string) => {
  const [list, setList] = useState<Array<any> | null>(initialList); // liste temporaire des objets à afficher
  const [page, setPage] = useState(1); //  numéro de la page affichée
  const [limit, setLimit] = useState(1000); // quantité d'objets à afficher
  const [totalPages] = useState(initialList.length);
  const [allChecked, setAllChecked] = useState(false);
  const [fieldSort, setFieldSort] = useState<string>(defaultSort);
  const [direction, setDirection] = useState<boolean>(true);

  /**
   * gère le cochage décochage d'une row individuelle
   * @param id number
   */
  const handleRowCheck = (id: number) => {
    setList((prevList: any) =>
      prevList.map((item: any) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
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
   * filtre la liste d'objets en fonction des filtes
   */
  const getFilteredList = useCallback(
    (filters: Array<{ field: string; value: string }>) => {
      let filteredList = initialList;
      // on applique chaque filtre sur la liste créée par l'utilisation précédente de la fonction filter
      filters.forEach((filter) => {
        filteredList = filteredList.filter(
          (item) => item[filter.field] === filter.value
        );
      });
      // on attribue la liste réduite par les applications successives des filtres au state "list"
      setList(filteredList);
    },
    [initialList]
  );

  /**
   * extration des différentes valeurs de la liste d'objets par propriété
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
    [initialList]
  );

  /**
   * réinitialise le state "list" avec la valeur de "initialList" et uncheck toutes les checkboxes de la liste
   */
  const resetFilters = useCallback(() => {
    setAllChecked(false);
    setList(initialList);
  }, [initialList]);

  const sortData = (column: string) => {
    console.log("coucou sorting");

    if (column === fieldSort) {
      setDirection((prevDirection) => !prevDirection);
    } else {
      setFieldSort(column);
      setDirection(true);
    }
  };

  /**
   * tri les colonnes du tableau quand l'utilisateur clique sur le nom d'une colonne : perfect future
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

  /**
   * gère le cochage / décochage de toutes les rows de la liste
   */
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
