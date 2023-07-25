import { FC, FormEvent } from "react";
import { useDispatch } from "react-redux";

import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import DrawerFormButtons from "../UI/drawer-form-buttons/drawer-form-buttons.component";
import DrawerDataFilter from "../UI/drawer-data-filter/drawer-data-filter.component";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";

type Props = {
  data: Array<any>; //  liste des objets importés depuis un fichier CSV et transformés en objets js
  origin: string;
  onCloseDrawer: (id: string) => void; //  ferme le drawer
};

const ImportedSkills: FC<Props> = ({ data, origin, onCloseDrawer }) => {
  const {
    allChecked,
    direction,
    fieldSort,
    list,
    sortData,
    setAllChecked,
    handleRowCheck,
    getSelecteditems,
    getFilteredList,
    getFieldValues,
    resetFilters,
  } = useEagerLoadingList(data, "description"); //  custom hook permettant de gérer l'affichage des données, quand la liste de compétences apparaît à l'écran elle est triée alphabétiquement par son intitulé
  const dispatch = useDispatch();

  /**
   * gère le coche / décochage de toutes les checkboxes
   */
  const handleAllChecked = () => {
    setAllChecked((prevState) => !prevState);
  };

  /**
   * remplace la liste des compétences par les compétences importées sélectionnées
   * ces dernières sont converties en objet de type Skill
   *
   * @param event FormEvent
   */
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    //  récupère les compétences sélectionnées
    const selectedSkills = getSelecteditems();
    //  stocke les compétences sélectionnées en mémoire
    dispatch(parcoursSkillsAction.addImportedSkillsToSkills(selectedSkills));
    setAllChecked(false);
    onCloseDrawer("import-skills");
  };

  // réinitialise les checkboxes et ferme le drawer
  const handleCancelButton = () => {
    setAllChecked(false);
    onCloseDrawer("import-skills");
  };

  return (
    <>
      <p className="mt-4">Choisissez les compétences à importer</p>
      {list ? (
        <>
          {origin === "db" ? (
            <div className="my-4">
              {list.length === 0 ? null : (
                <DrawerDataFilter
                  parcours={getFieldValues("parcours").sort()}
                  getFilteredList={getFilteredList}
                  resetFilters={resetFilters}
                />
              )}
            </div>
          ) : null}
          {list.length > 0 ? (
            <form className="w-full" onSubmit={handleSubmit}>
              <table className="w-full table border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th>
                      <input
                        className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                        type="checkbox"
                        checked={allChecked}
                        onChange={handleAllChecked}
                      />
                    </th>
                    <th
                      className="cursor-pointer"
                      onClick={() => sortData("description")}
                    >
                      <div className="flex items-center justify-between">
                        <p>Compétence</p>
                        <SortColumnIcon
                          fieldSort={fieldSort}
                          column="description"
                          direction={direction}
                        />
                      </div>
                    </th>
                    {origin === "db" ? (
                      <th
                        className="cursor-pointer items-center justify-between"
                        onClick={() => sortData("parcours")}
                      >
                        <div className="flex items-center justify-between">
                          <p>Parcours</p>
                          <SortColumnIcon
                            fieldSort={fieldSort}
                            column="parcours"
                            direction={direction}
                          />
                        </div>
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {list.map((item: any, index: number) => (
                    <tr
                      className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content w-full"
                      key={index}
                    >
                      <td className="bg-transparent rounded-l-xl">
                        <input
                          className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                          type="checkbox"
                          checked={
                            item.isSelected !== undefined
                              ? item.isSelected
                              : false
                          }
                          onChange={() => handleRowCheck(item.id)}
                        />
                      </td>
                      <td className="bg-transparent capitalize w-1/4 truncate">
                        {item.description}
                      </td>
                      {origin === "db" ? (
                        <td className="bg-transparent capitalize w-xs truncate">
                          {item.parcours}
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
              <DrawerFormButtons onCancel={handleCancelButton} />
            </form>
          ) : (
            <p className="px-4">
              Aucune compétence ne correspond aux critères de recherche
            </p>
          )}
        </>
      ) : null}
    </>
  );
};

export default ImportedSkills;
