import { FC, useCallback } from "react";

import CsvImport from "./csv-import/csv-import.component";

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

  const downloadFile = (url: string, filename: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Créer un lien temporaire pour télécharger le fichier
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename;

        // Simuler un clic sur le lien pour démarrer le téléchargement
        downloadLink.click();

        // Nettoyer les ressources temporaires
        URL.revokeObjectURL(downloadLink.href);
      })
      .catch((error) => {
        console.error("Erreur lors du téléchargement du fichier:", error);
      });
  };

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
