import { FC, useCallback } from "react";
import { useDispatch } from "react-redux";

import CsvImportSkills from "./csv-import-skills.component";
import DbImportSkills from "./db-import-skills.component";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";

type Props = {
  origin: string;
  onFromDB: (value: string) => void;
};

const ImpoortSkillsActions: FC<Props> = ({ origin, onFromDB }) => {
  const dispatch = useDispatch();

  const storeSkills = useCallback(
    (data: any) => {
      dispatch(parcoursSkillsAction.importSkills(data));
    },
    [dispatch]
  );

  const handleFromCSV = useCallback(
    (data: any) => {
      storeSkills(data);
      onFromDB("csv");
    },
    [onFromDB, storeSkills]
  );

  const handleFromDB = (data: any) => {
    storeSkills(data);
    onFromDB("db");
  };

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
        <CsvImportSkills origin={origin} onParseCsv={handleFromCSV} />
        <DbImportSkills origin={origin} onFetchSkills={handleFromDB} />
      </div>
      <p
        className="text-primary text-xs hover:underline pl-2 cursor-pointer"
        onClick={() =>
          downloadFile(
            "http://localhost:5001/csv-competences-modele.txt",
            "csv-competences-modele.txt"
          )
        }
      >
        Télécharger ici un modèle en CSV
      </p>
    </>
  );
};

export default ImpoortSkillsActions;
