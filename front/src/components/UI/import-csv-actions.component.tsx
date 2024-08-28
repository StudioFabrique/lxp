/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback } from "react";

import CsvImport from "./csv-import/csv-import.component";
import { downloadFile } from "../../helpers/download-csv-template";

type Props = {
  fields: Array<string>;
  modelFileUrl: string;
  modelFileName: string;
  onHandleFromCSV: (data: Array<any>) => void;
};

const ImportCSVActions: FC<Props> = ({
  fields,
  modelFileUrl,
  modelFileName,
  onHandleFromCSV,
}) => {
  const handleFromCSV = useCallback(
    (data: any) => {
      onHandleFromCSV(data);
    },

    [onHandleFromCSV]
  );

  return (
    <>
      <div className="flex gap-x-4 justify-evenly">
        <CsvImport origin={origin} onParseCsv={handleFromCSV} fields={fields} />
      </div>
      <p
        className="text-primary text-xs hover:underline pl-2 cursor-pointer flex justify-center"
        onClick={() => downloadFile(modelFileUrl, modelFileName)}
      >
        Télécharger ici un modèle en CSV
      </p>
    </>
  );
};

export default ImportCSVActions;
