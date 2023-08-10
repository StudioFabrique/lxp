import { FC, FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import DrawerFormButtons from "../UI/drawer-form-buttons/drawer-form-buttons.component";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import Skill from "../../utils/interfaces/skill";
import { toast } from "react-hot-toast";
import useHttp from "../../hooks/use-http";

type Props = {
  onCloseDrawer: (id: string) => void; //  ferme le drawer
};

const ImportedSkills: FC<Props> = ({ onCloseDrawer }) => {
  const skills = useSelector(
    (state: any) => state.parcoursSkills.importedSkills
  );
  const parcoursId = useSelector((state: any) => state.parcours.id);
  const {
    allChecked,
    direction,
    fieldSort,
    list,
    sortData,
    setAllChecked,
    handleRowCheck,
    getSelecteditems,
  } = useEagerLoadingList(skills, "description"); //  custom hook permettant de gérer l'affichage des données, quand la liste de compétences apparaît à l'écran elle est triée alphabétiquement par son intitulé
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();

  /**
   * gère le coche / décochage de toutes les checkboxes
   */
  const handleAllChecked = () => {
    setAllChecked((prevState) => !prevState);
  };

  /**
   *
   * @param skills Array<any>  (Skill)
   */
  const postSelectedSkills = (skills: Array<any>) => {
    const processData = (data: { success: boolean; skills: Array<Skill> }) => {
      if (data.success) {
        toast.success("Les compétences du parcours ont été mises à jour");
        //  stocke les compétences renvoyées par la requête avec l'id générée par la bdd en mémoire
        dispatch(
          parcoursSkillsAction.addImportedSkillsToSkills(
            data.skills.map((item: any) => ({ ...item, isBonus: true }))
          )
        );
      }
    };
    sendRequest(
      {
        path: "/bonus-skill/skills",
        method: "post",
        // on transforme les objets du tableau en un objet qui soit corresponde au modèle de données de la bdd
        body: {
          parcoursId,
          skills: skills.map((item: any) => ({
            description: item.description,
          })),
        },
      },
      processData
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

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
    if (selectedSkills && selectedSkills.length > 0) {
      postSelectedSkills(selectedSkills);
    }
    setAllChecked(false);
    onCloseDrawer("import-skills");
  };

  // réinitialise les checkboxes et ferme le drawer
  const handleCancelButton = () => {
    dispatch(parcoursSkillsAction.importSkills([]));
    setAllChecked(false);
    onCloseDrawer("import-skills");
  };

  return (
    <>
      {list && list.length > 0 ? (
        <>
          <p className="mt-4">Choisissez les compétences à importer</p>
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
                    <div className="flex items-center gap-x-2">
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
                      className="cursor-pointer items-center flex gap-x-2"
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
        </>
      ) : (
        <p className="px-4 mt-4">Aucune compétence trouvée</p>
      )}
    </>
  );
};

export default ImportedSkills;
