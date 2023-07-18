import { FC, FormEvent } from "react";
import { useDispatch } from "react-redux";

import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import DrawerFormButtons from "../UI/drawer-form-buttons/drawer-form-buttons.component";
import { parcoursAction } from "../../store/redux-toolkit/parcours";
import DrawerDataFilter from "../UI/drawer-data-filter/drawer-data-filter.component";

type Props = {
  data: Array<any>; //  liste des objets importés depuis un fichier CSV et transformés en objets js
  fromDB: boolean;
  onCloseDrawer: (id: string) => void; //  ferme le drawer
};

const ImportedSkills: FC<Props> = ({ data, fromDB, onCloseDrawer }) => {
  const {
    allChecked,
    list,
    sortData,
    setAllChecked,
    handleRowCheck,
    getSelecteditems,
    getFilteredList,
    getFieldValues,
    resetFilters,
  } = useEagerLoadingList(data, "title"); //  custom hook permettant de gérer l'affichage des données, quand la liste de compétences apparaît à l'écran elle est triée alphabétiquement par son intitulé
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
    dispatch(parcoursAction.addImportedSkillsToSkills(selectedSkills));
    onCloseDrawer("import-skills");
  };

  // réinitialise les checkboxes et ferme le drawer
  const handleCancelButton = () => {
    setAllChecked(false);
    onCloseDrawer("import-skills");
  };

  console.log({ fromDB });

  return (
    <>
      <p className="mt-4">Choisissez les compétences à importer</p>
      {list ? (
        <>
          {fromDB ? (
            <div className="my-4">
              {list.length === 0 ? null : (
                <DrawerDataFilter
                  formations={getFieldValues("formation").sort()}
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
                      onClick={() => sortData("title")}
                    >
                      Intitulé
                    </th>
                    {fromDB ? (
                      <>
                        <th
                          className="cursor-pointer"
                          onClick={() => sortData("formation")}
                        >
                          Formation
                        </th>
                        <th
                          className="cursor-pointer"
                          onClick={() => sortData("parcours")}
                        >
                          Parcours
                        </th>
                      </>
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
                      {fromDB ? (
                        <>
                          <td className="bg-transparent capitalize w-xs truncate">
                            {item.formation}
                          </td>
                          <td className="bg-transparent capitalize w-xs truncate">
                            {item.parcours}
                          </td>
                        </>
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
