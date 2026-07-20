import { FC, useCallback } from "react";
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import { useParams } from "react-router";

import ImportCSVActions from "../../../../../../src/components/UI/import-csv-actions.component";
import { DOWNLOAD_URL } from "../../../../../config/urls";
import ImportedCSVData from "../../../../../../src/components/UI/imported-csv-data.component";
import { objectivesFields } from "../../../../../config/csv/csv-objectives";
import toast from "react-hot-toast";
import { useParcoursQuery } from "../../../hooks/useParcoursQuery";
import { useUpdateParcours } from "../../../hooks/useUpdateParcours";
import type Objective from "../../../../../utils/interfaces/objective";

type Props = {
  onCloseDrawer: (id: string) => void;
};

const ImportObjectives: FC<Props> = ({ onCloseDrawer }) => {
  const protocol = window.location.href.split("/")[0];
  const dispatch = useParcoursDispatch();
  const objectives = useParcoursSelector(
    (state) => state.parcoursObjectives.importedObjectives
  );
  const { id } = useParams();
  const parcoursId = Number(id);
  const { data: parcours } = useParcoursQuery(parcoursId);
  const updateParcours = useUpdateParcours(parcoursId);

  const importObjectives = (objectives: string[]) => {
    const descriptions = [
      ...(parcours?.objectives.map((objective) => objective.description) ?? []),
      ...objectives,
    ];
    updateParcours.mutate(
      { objectives: [...new Set(descriptions)] },
      {
        onSuccess: () => toast.success("Objectifs importés"),
        onError: () => toast.error("Erreur lors de l'import"),
      },
    );
  };

  const handleCloseDrawer = () => {
    onCloseDrawer("import-data");
  };

  const postSelectedObjectives = (objectives: Objective[]) => {
    handleCloseDrawer();
    importObjectives(objectives.map((item) => item.description));
  };

  const handleFromCSV = useCallback(
    (data: Objective[]) => {
      dispatch({ type: "IMPORT_OBJECTIVES", payload: data });
    },
    [dispatch]
  );

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <ImportCSVActions
        modelFileUrl={`${protocol + DOWNLOAD_URL}/csv-objectifs-modele.csv`}
        modelFileName={"csv-objectifs-modele.csv"}
        onHandleFromCSV={handleFromCSV}
        fields={objectivesFields}
      />
      {objectives ? (
        <ImportedCSVData
          data={objectives}
          label={"compétences"}
          field="description"
          onCloseDrawer={handleCloseDrawer}
          onPostData={postSelectedObjectives}
        />
      ) : null}
    </div>
  );
};

export default ImportObjectives;
