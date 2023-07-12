import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import ImportButton from "./import-csv-button.component";
import BadgeIcon from "../UI/svg-icons/badge-icon.component";
import { parcoursAction } from "../../store/redux-toolkit/parcours";

const SkillsHeader = () => {
  const dispatch = useDispatch();

  /**
   * stockage en mémoire des données fraîchement parsés depuis un fichier .csv
   */
  const handleCsvSkillsImport = (csvData: Array<any>) => {
    dispatch(parcoursAction.importCsvSkills(csvData));
  };

  return (
    <div className="w-full flex justify-between items-center">
      <h3 className="text-xl font-bold">Compétences</h3>
      <div className="flex items-center gap-x-8">
        <ImportButton
          label="Importer des compétences"
          onClickEvent={handleCsvSkillsImport}
        />
        <Link className="flex gap-x-1 text-primary items-center" to="#">
          <BadgeIcon size={4} color="primary" />
          <p>Gestion des badges</p>
        </Link>
        <button className="btn btn-primary capitalize">sauvegarder</button>
      </div>
    </div>
  );
};

export default SkillsHeader;
