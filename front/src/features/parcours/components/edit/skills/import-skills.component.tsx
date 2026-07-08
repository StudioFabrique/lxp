import { FC, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";

import useHttp from "../../../../../../src/hooks/useHttp";
import Skill from "../../../../../../src/utils/interfaces/skill";
import ImportCSVActions from "../../../../../../src.legacy/components/UI/import-csv-actions.component";
import { DOWNLOAD_URL } from "../../../../../config/urls";
import ImportedCSVData from "../../../../../../src.legacy/components/UI/imported-csv-data.component";
import { skillsFields } from "../../../../../config/csv/csv-skills-fields";

type Props = {
  onCloseDrawer: (id: string) => void;
};

const ImportSkills: FC<Props> = ({ onCloseDrawer }) => {
  const protocol = window.location.href.split("/")[0];

  const dispatch = useParcoursDispatch();
  const skills = useParcoursSelector(
    (state) => state.parcoursSkills.importedSkills
  );
  const parcoursId = useParcoursSelector((state) => state.parcours.id);
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
        dispatch(
          { type: "ADD_IMPORTED_SKILLS", payload: data.skills.map((item: any) => ({ ...item, isBonus: true })) }
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

  const handleFromCSV = useCallback(
    (data: Array<any>) => {
      dispatch({ type: "IMPORT_SKILLS", payload: data });
    },
    [dispatch]
  );

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <ImportCSVActions
        modelFileUrl={`${protocol + DOWNLOAD_URL}/csv-competences-modele.csv`}
        modelFileName={"csv-competences-modele.csv"}
        onHandleFromCSV={handleFromCSV}
        fields={skillsFields}
      />
      {skills ? (
        <ImportedCSVData
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
