/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Papa from "papaparse";

import { checkCSV } from "../../../../../../config/csv/csv-check";
import toast from "react-hot-toast";
import { downloadFile } from "../../../../../../utils/helpers/download-csv-template";
import { DOWNLOAD_URL } from "../../../../../../config/urls";
import FileUpload from "../../../../../../components/UI/file-upload/FileUpload";

type Props = {
  origin: string;
  onParseCsv: (data: any) => void;
  fields: Array<string>;
  type?: "icon" | "text";
};

const CsvImportUser: FC<Props> = ({ origin, onParseCsv, fields, type }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isEmptyingReady, setEmptyingReadyState] = useState<boolean>(false);

  const commonConfig = useMemo(
    () => ({
      worker: true,
    }),
    [],
  );

  const handleSelectedFile = (file: File) => {
    setFileError(null);
    setSelectedFile(file);
  };

  const handleEmptyFile = useCallback(() => {
    setEmptyingReadyState(true);
    if (isEmptyingReady) {
      setSelectedFile(null);
      setEmptyingReadyState(false);
    }
  }, [isEmptyingReady]);

  const handleDownloadFile = () => {
    downloadFile(
      `${DOWNLOAD_URL}/csv-users-group-modele.csv`,
      "csv-users-group-modele",
    );
  };

  useEffect(() => {
    if (selectedFile) {
      Papa.parse(selectedFile, {
        ...commonConfig,
        header: true,
        complete: (result: any) => {
          if (checkCSV(fields, result.meta.fields)) {
            onParseCsv(result.data);
            handleEmptyFile();
          } else {
            setFileError("Format des données non conforme");
          }
        },
      });
    }
  }, [selectedFile, commonConfig, fields, onParseCsv, handleEmptyFile]);

  useEffect(() => {
    if (fileError) toast.error(fileError);
  });

  return (
    <>
      <div className={type === "text" ? "flex items-center gap-3" : ""}>
        <FileUpload
          compact={type === "text"}
          fileType="csv"
          maxSize={50 * 1024}
          buttonLabel="Importer une liste d'étudiants"
          helperText={
            origin === "csv" ? "Fichier CSV conforme au modèle fourni" : undefined
          }
          error={fileError}
          onFileSelect={handleSelectedFile}
        />
        {type === "text" && (
          <button
            type="button"
            onClick={handleDownloadFile}
            className="btn btn-sm btn-ghost whitespace-nowrap"
          >
            Télécharger le modèle en csv
          </button>
        )}
      </div>
    </>
  );
};

export default CsvImportUser;
