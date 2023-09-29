import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import RefreshIcon from "../svg/refresh-icon.component";

type Props = {
  parcours: Array<string>;
  getFilteredList: (filters: Array<Filter>) => void;
  resetFilters: () => void;
};

type Filter = {
  field: string;
  value: string;
};

/**
 * Ce composant permet de filtrer les compétences importées depuis un fichier au format csv
 * par formation et par parcours
 *
 * @param Props
 * @returns JSX
 */
const DrawerDataFilter: FC<Props> = ({
  parcours,
  getFilteredList,
  resetFilters,
}) => {
  const [filters, setFilters] = useState<Array<Filter>>([]); //  liste des filtres à appliquer sur la liste des compétences importées depuis un fichier csv
  const [selectPromotion, setSelectPromotion] = useState<string>("Tous");

  /**
   * réinitialise les filtres et les valeurs affichées dans les menus select aux valeurs par défaut
   */
  const handleResetFilters = useCallback(() => {
    resetFilters();
    setSelectPromotion("Tous");
  }, [resetFilters]);

  /**
   * Gère la sélection d'une formation dans le menu select
   * @param event ChangeEvent<HTMLSelectElement>
   */
  const handleParcoursSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    //  si l'utilisateur clique sur "Toutes" le filtre formation est retiré de la liste des filtres
    if (event.currentTarget.value === "all") {
      setSelectPromotion("Toutes");
      setFilters((prevFilters) =>
        prevFilters.filter((item) => item.field !== "parcours")
      );
    } else {
      setSelectPromotion(event.currentTarget.value);
      //  le filtre actuel est retiré de la liste
      const updatedFilters = filters.filter(
        (item) => item.field !== "parcours"
      );
      // on ajoute le nouveau filtre
      updatedFilters.push({
        field: "parcours",
        value: event.currentTarget.value,
      });
      setFilters(updatedFilters);
    }
  };

  // mise à jour de la liste des compétences en fonction des filtres
  useEffect(() => {
    // si le tableau des filtres est vide on réinitialise la liste des compétences affichées à la liste de départ
    if (!filters || filters.length === 0) {
      handleResetFilters();
      return;
    } else {
      // application des filtres
      getFilteredList(filters);
    }
  }, [filters, getFilteredList, handleResetFilters]);

  useEffect(() => {
    handleResetFilters();
  }, [handleResetFilters]);

  console.log("filter rendering");

  return (
    <div className="w-full flex justify-start items-center gap-x-2">
      <div className="flex items-center">
        <label className="text-xs mr-4" htmlFor="parcours">
          Parcours
        </label>
        <select
          className="select select-xs select-bordered font-normal"
          name="parcours"
          id="parcours"
          onChange={handleParcoursSelect}
          value={selectPromotion}
        >
          <option value="all">Tous</option>
          {parcours.map((item: string, index: number) => (
            <option className="capitalize" key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="text-primary cursor-pointer" onClick={handleResetFilters}>
        <RefreshIcon size={4} />
      </div>
    </div>
  );
};

export default DrawerDataFilter;
