import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Papa from "papaparse";
import { checkCSV } from "../../../config/csv/csv-check";
import FileUpload from "../file-upload/FileUpload";

type CsvRow = Record<string, string>;

type Props = {
  origin: string;
  onParseCsv: (data: CsvRow[]) => void;
  fields: Array<string>;
  type?: "icon" | "text";
};

const CsvImport: FC<Props> = ({ origin, onParseCsv, fields, type }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isEmptyingReady, setEmptyingReadyState] = useState<boolean>(false);
  const [filename, setFilename] = useState<string | null>(null);

  const commonConfig = useMemo(
    () => ({
      worker: true,
    }),
    []
  );

  /*   useEffect(() => {
    if (isOpening) {
      setFileError(null);
      setFilename(null);
      setSelectedFile(null);
    }
  }, [isOpening]); */

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

  useEffect(() => {
    if (selectedFile) {
      Papa.parse<CsvRow>(selectedFile, {
        ...commonConfig,
        header: true,
        complete: (result) => {
          if (checkCSV(fields, result.meta.fields ?? [])) {
            result.data.pop();
            onParseCsv(result.data);
            setFilename(selectedFile.name);
            handleEmptyFile();
          } else {
            setFileError("Format des données non conforme");
          }
        },
      });
    }
  }, [selectedFile, commonConfig, fields, onParseCsv, handleEmptyFile]);

  return (
    <>
      <FileUpload
        compact={type === "text"}
        fileType="csv"
        maxSize={50 * 1024}
        buttonLabel={filename ?? "Importer une liste d'étudiants"}
        helperText={
          origin === "csv" ? "Fichier CSV conforme au modèle fourni" : undefined
        }
        error={fileError}
        onFileSelect={handleSelectedFile}
      />
    </>
  );
};

export default CsvImport;
