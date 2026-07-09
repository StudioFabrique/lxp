import { FC, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import { useMutation } from "@tanstack/react-query";

import ImportCSVActions from "../../../../../../src/components/UI/import-csv-actions.component";
import { DOWNLOAD_URL } from "../../../../../config/urls";
import ImportedCSVData from "../../../../../../src/components/UI/imported-csv-data.component";
import { skillsFields } from "../../../../../config/csv/csv-skills-fields";
import { parcoursApi } from "../../../api/parcours.api";

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

  const { mutate: importSkills } = useMutation({
    mutationFn: (
      skillsData: { description: string }[]
    ) => parcoursApi.mutations.importSkills({
      parcoursId: parcoursId!,
      skills: skillsData,
    }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Les compétences du parcours ont été mises à jour");
        dispatch(
          { type: "ADD_IMPORTED_SKILLS", payload: data.skills.map((item: any) => ({ ...item, isBonus: true })) }
        );
      }
    },
    onError: () => toast.error("Erreur lors de l'import"),
  });

  const handleCloseDrawer = () => {
    onCloseDrawer("import-data");
  };

  const postSelectedSkills = (skills: Array<any>) => {
    handleCloseDrawer();
    importSkills(
      skills.map((item: any) => ({ description: item.description }))
    );
  };

  const handleFromCSV = useCallback(
    (data: Array<any>) => {
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
