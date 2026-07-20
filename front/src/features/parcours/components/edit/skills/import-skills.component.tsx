import { FC, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import { useParams } from "react-router";

import ImportCSVActions from "../../../../../../src/components/UI/import-csv-actions.component";
import { DOWNLOAD_URL } from "../../../../../config/urls";
import ImportedCSVData from "../../../../../../src/components/UI/imported-csv-data.component";
import { skillsFields } from "../../../../../config/csv/csv-skills-fields";
import { useParcoursSkillMutations } from "../../../hooks/useParcoursSkillMutations";

type Props = {
  onCloseDrawer: (id: string) => void;
};

type ImportedSkill = Record<string, unknown> & { description: string };

const ImportSkills: FC<Props> = ({ onCloseDrawer }) => {
  const protocol = window.location.href.split("/")[0];

  const dispatch = useParcoursDispatch();
  const skills = useParcoursSelector(
    (state) => state.parcoursSkills.importedSkills
  );
  const { id } = useParams();
  const parcoursId = Number(id);
  const { importSkills } = useParcoursSkillMutations(parcoursId);

  const handleCloseDrawer = () => {
    onCloseDrawer("import-data");
  };

  const postSelectedSkills = (skills: ImportedSkill[]) => {
    handleCloseDrawer();
    importSkills.mutate(
      skills.map((item) => ({ description: item.description })),
      {
        onSuccess: () =>
          toast.success("Les compétences du parcours ont été mises à jour"),
        onError: () => toast.error("Erreur lors de l'import"),
      },
    );
  };

  const handleFromCSV = useCallback(
    (data: ImportedSkill[]) => {
      dispatch({ type: "IMPORT_SKILLS", payload: data });
    },
    [dispatch]
  );

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
