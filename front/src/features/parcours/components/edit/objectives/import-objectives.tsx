import { FC, useCallback } from "react";
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";
import { useMutation } from "@tanstack/react-query";

import ImportCSVActions from "../../../../../../src/components/UI/import-csv-actions.component";
import { DOWNLOAD_URL } from "../../../../../config/urls";
import ImportedCSVData from "../../../../../../src/components/UI/imported-csv-data.component";
import { objectivesFields } from "../../../../../config/csv/csv-objectives";
import { parcoursApi } from "../../../api/parcours.api";
import toast from "react-hot-toast";

type Props = {
  onCloseDrawer: (id: string) => void;
};

const ImportObjectives: FC<Props> = ({ onCloseDrawer }) => {
  const protocol = window.location.href.split("/")[0];
  const dispatch = useParcoursDispatch();
  const objectives = useParcoursSelector(
    (state) => state.parcoursObjectives.importedObjectives
  );
  const parcoursId = useParcoursSelector((state) => state.parcours.id);

  const { mutate: importObjectives } = useMutation({
    mutationFn: (objectives: string[]) =>
      parcoursApi.mutations.updateParcoursObjectives({
        parcoursId: parcoursId!,
        objectives,
      }),
    onSuccess: (data) => {
      dispatch(
        { type: "ADD_IMPORTED_OBJECTIVES", payload: data.data.objectives }
      );
    },
    onError: () => toast.error("Erreur lors de l'import"),
  });

  const handleCloseDrawer = () => {
    onCloseDrawer("import-data");
  };

  const postSelectedObjectives = (objectives: Array<any>) => {
    handleCloseDrawer();
    importObjectives(objectives.map((item: any) => item.description));
  };

  const handleFromCSV = useCallback(
    (data: Array<any>) => {
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
