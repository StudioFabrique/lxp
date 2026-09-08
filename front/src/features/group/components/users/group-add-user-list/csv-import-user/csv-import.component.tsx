import { FC, useState } from "react";
import Papa from "papaparse";

import { checkCSV } from "../../../../../../config/csv/csv-check";
import toast from "react-hot-toast";
import FileUpload from "../../../../../../components/UI/file-upload/FileUpload";
import type User from "../../../../../../utils/interfaces/user";

type Props = {
  onParseCsv: (data: User[]) => void;
  fields: Array<string>;
};

type CsvUser = Record<string, string>;

const CsvImportUser: FC<Props> = ({ onParseCsv, fields }) => {
  const [fileError, setFileError] = useState<string | null>(null);

  const showFileError = (message: string) => {
    setFileError(message);
    toast.error(message);
  };

  const handleSelectedFile = (file: File) => {
    setFileError(null);
    Papa.parse<CsvUser>(file, {
      worker: true,
      header: true,
      skipEmptyLines: "greedy",
      complete: (result) => {
        if (!checkCSV(fields, result.meta.fields ?? [])) {
          showFileError("Format des données non conforme");
          return;
        }

        if (result.data.length === 0) {
          showFileError("Le fichier CSV ne contient aucun étudiant");
          return;
        }

        onParseCsv(result.data as unknown as User[]);
      },
      error: () => {
        showFileError("Le fichier CSV n'a pas pu être lu");
      },
    });
  };

  return (
    <FileUpload
      compact
      preserveButtonLabel
      fileType="csv"
      maxSize={50 * 1024}
      buttonLabel="Importer"
      helperText="Fichier CSV conforme au modèle fourni"
      error={fileError}
      onFileSelect={handleSelectedFile}
      className="max-w-md"
      buttonClassName="h-32 w-full border-2 border-dashed border-primary bg-transparent text-primary hover:border-primary hover:bg-primary/10"
    />
  );
};

export default CsvImportUser;
