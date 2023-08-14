import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";

import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import CsvImport from "./csv-import/csv-import.component";
import { skillsFields } from "../../config/csv/csv-skills-fields";

type Props = {
  modelFileUrl: string;
  modelFileName: string;
};

const ImportCSVActions: FC<Props> = ({ modelFileUrl, modelFileName }) => {
  const dispatch = useDispatch();

  const handleFromCSV = useCallback(
    (data: any) => {
      dispatch(parcoursSkillsAction.importSkills(data));
    },

    [dispatch]
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
        <CsvImport
          origin={origin}
          onParseCsv={handleFromCSV}
          fields={skillsFields}
        />
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
