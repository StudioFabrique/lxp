import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";

import UploadIcon from "../UI/svg-icons/upload-icon.component";
import { checkCSV } from "../../utils/check-csv";
import { skillsFields } from "../../config/csv/csv-skills-fields";

type Props = { origin: string; onParseCsv: (data: any) => void };

const CsvImportSkills: FC<Props> = ({ origin, onParseCsv }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const commonConfig = useMemo(
    () => ({
      worker: true,
    }),
    []
  );

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

  useEffect(() => {
    if (selectedFile) {
      Papa.parse(selectedFile, {
        ...commonConfig,
        header: true,
        complete: (result: any) => {
          console.log("resultat", result.meta);
          if (checkCSV(skillsFields, result.meta.fields)) {
            result.data.pop();
            onParseCsv(result.data);
          } else {
            setFileError("Format des données non conforme");
          }
        },
      });
    }
  }, [selectedFile, commonConfig, onParseCsv]);

  return (
    <>
      <div
        className={`group w-[13rem] h-[8rem] flex flex-col text-xs gap-y-4 p-4 justify-center items-center font-bold rounded-xl shadow-xl border-2 hover:bg-primary ${
          fileError
            ? "border-error"
            : selectedFile
            ? "border-success"
            : "border-primary/50"
        } ${origin === "csv" ? "bg-primary" : ""}`}
        onClick={handleFileSelection}
      >
        <div
          className={`flex flex-col justify-center items-center gap-y-4 group-hover:text-white ${
            origin === "csv" ? "text-white" : ""
          }`}
        >
          <UploadIcon size={10} />
          <p className={`${fileError ? "text-error" : ""}`}>
            {fileError
              ? fileError
              : selectedFile
              ? selectedFile.name
              : "Sélectionner un fichier"}
          </p>
        </div>
      </div>
      <input
        className="hidden"
        ref={fileRef}
        type="file"
        id="fileSelect"
        name="fileSelect"
        accept=".csv"
        onChange={handleSelectedFile}
      />
    </>
  );
};

export default CsvImportSkills;
