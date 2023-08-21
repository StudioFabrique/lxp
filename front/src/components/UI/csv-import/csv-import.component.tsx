import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Papa from "papaparse";

import UploadIcon from "../svg/upload-icon.component";
import { checkCSV } from "../../../utils/check-csv";

type Props = {
  origin: string;
  onParseCsv: (data: any) => void;
  fields: Array<string>;
  type?: "icon" | "text";
};

const CsvImport: FC<Props> = ({ origin, onParseCsv, fields, type }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isEmptyingReady, setEmptyingReadyState] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
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

  const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = event.target.files;

    if (files && files.length > 0) {
      if (files[0].type !== "text/csv") {
        setFileError("Ceci n'est pas un fichier au format CSV");
        return;
      }
      if (files[0].size > 50 * 1024) {
        setFileError("La taille du fichier doit être inférieure à 50ko");
        return;
      }
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelection = () => {
    if (selectedFile && fileRef.current) {
      fileRef.current.value = "";
    }
    if (fileRef) {
      fileRef.current?.click();
    }
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
      Papa.parse(selectedFile, {
        ...commonConfig,
        header: true,
        complete: (result: any) => {
          if (checkCSV(fields, result.meta.fields)) {
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
      {type === undefined || type === "icon" ? (
        <div
          className={`group w-[13rem] h-[8rem] flex flex-col text-xs gap-y-4 p-4 justify-center items-center font-bold rounded-xl shadow-xl border-2 cursor-pointer ${
            fileError ? "border-error" : "border-primary/50"
          } ${origin === "csv" ? "bg-primary" : ""}`}
          onClick={handleFileSelection}
        >
          <div
            className={`flex flex-col justify-center items-center gap-y-4 group-hover:text-white ${
              origin === "csv" ? "text-white" : ""
            }`}
          >
            {!fileError ? (
              <>
                <UploadIcon size={10} />{" "}
                <p className={`${fileError ? "text-error" : ""}`}>
                  {filename ? filename : "Sélectionner un fichier"}
                </p>
              </>
            ) : null}

            {fileError && fileError.length > 0 ? (
              <p className="text-xs font-normal">
                Le fichier ne correspond pas au modèle de fichier CSV attendu,
                vous pouvez télécharger un exemple de fichier CSV en cliquant
                sur le lien ci-dessous.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div onClick={handleFileSelection} className="cursor-pointer">
          <p>Importer une liste d'étudiant</p>
        </div>
      )}
      <input
        className="hidden"
        ref={fileRef}
        type="file"
        id="fileSelect"
        name="fileSelect"
        accept=".csv"
        key={Date.now()}
        onChange={handleSelectedFile}
      />
    </>
  );
};

export default CsvImport;
