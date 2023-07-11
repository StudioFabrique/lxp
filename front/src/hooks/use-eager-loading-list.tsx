import { useEffect, useState } from "react";
import { getPagination } from "../utils/get-pagination";

const useEagerLoadingList = (initialList: Array<any>) => {
  const [list, setList] = useState<Array<any> | null>(initialList); // liste temporaire des objets à afficher
  const [page, setPage] = useState(1); //  numéro de la page affichée
  const [limit, setLimit] = useState(1000); // quantité d'objets à afficher
  const [totalPages] = useState(initialList.length);
  const [allChecked, setAllChecked] = useState(false);

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
   * modifie le contenu de la liste des objets à afficher en fonction des action de l'utlisateur (changement de page)
   */
  useEffect(() => {
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

  console.log({ list });

  return {
    allChecked,
    list,
    page,
    totalPages,
    setAllChecked,
    setPage,
    setLimit,
    handleRowCheck,
  };
};

export default useEagerLoadingList;
