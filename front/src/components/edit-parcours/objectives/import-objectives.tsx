/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import useHttp from "../../../hooks/use-http";
import ImportCSVActions from "../../UI/import-csv-actions.component";
import { DOWNLOAD_URL } from "../../../config/urls";
import ImportedCSVData from "../../UI/imported-csv-data.component";
import { parcoursObjectivesAction } from "../../../store/redux-toolkit/parcours/parcours-objectives";
import { objectivesFields } from "../../../config/csv/csv-objectives";

type Props = {
  onCloseDrawer: (id: string) => void;
};

const ImportObjectives: FC<Props> = ({ onCloseDrawer }) => {
  const protocol = window.location.href.split("/")[0];
  const dispatch = useDispatch();
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.importedObjectives
  );
  const parcoursId = useSelector((state: any) => state.parcours.id);
  const { sendRequest } = useHttp();

  const handleCloseDrawer = () => {
    onCloseDrawer("import-data");
  };

  const postSelectedObjectives = (objectives: Array<any>) => {
    handleCloseDrawer();

    const applyData = (data: any) => {
      dispatch(
        parcoursObjectivesAction.addImportedObjectivesToObjectives(
          data.data.objectives
        )
      );
    };
    sendRequest(
      {
        path: "/parcours/update-objectives",
        method: "put",
        body: {
          parcoursId,
          objectives: objectives.map((item: any) => item.description),
        },
      },
      applyData
    );
  };

  const handleFromCSV = useCallback(
    (data: Array<any>) => {
      dispatch(parcoursObjectivesAction.importObjectives(data));
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
