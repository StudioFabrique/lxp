import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import ImportedSkills from "./imported-skills.component";
import ImportCSVActions from "./import-skills-actions.component";
import { parcoursSkillsAction } from "../../../store/redux-toolkit/parcours/parcours-skills";
import useHttp from "../../../hooks/use-http";
import Skill from "../../../utils/interfaces/skill";

type Props = {
  onCloseDrawer: (id: string) => void;
};

const ImportSkills: FC<Props> = ({ onCloseDrawer }) => {
  const dispatch = useDispatch();
  const skills = useSelector(
    (state: any) => state.parcoursSkills.importedSkills
  );
  const parcoursId = useSelector((state: any) => state.parcours.id);
  const { sendRequest, error } = useHttp();

  const handleCloseDrawer = () => {
    onCloseDrawer("import-data");
  };

  /**
   * requête HTTP POST vers le serveur, ajoute en mémoire les compétences importées à la liste des compétences
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
    handleCloseDrawer();
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

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <ImportCSVActions
        modelFileUrl={"http://localhost:5001/csv-competences-modele.txt"}
        modelFileName={"csv-competences-modele.txt"}
      />
      {skills ? (
        <ImportedSkills
          data={skills}
          label={"compétences"}
          field="description"
          onCloseDrawer={handleCloseDrawer}
          onPostData={postSelectedSkills}
        />
      ) : null}
    </div>
  );
};

export default ImportSkills;
