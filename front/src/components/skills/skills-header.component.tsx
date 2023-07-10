import { Link } from "react-router-dom";
import ImportButton from "./import-button.component";
import BadgeIcon from "../UI/svg-icons/badge-icon.component";

const SkillsHeader = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <h3 className="text-xl font-bold">Compétences</h3>
      <div className="flex items-center gap-x-8">
        <ImportButton label="Importer des compétences" />
        <Link className="flex gap-x-1 text-primary items-center" to="#">
          <BadgeIcon size={4} color="primary" />
          <p>Gestion des badges</p>
        </Link>
        <ImportButton label="Sauvegarder" outline={false} />
      </div>
    </div>
  );
};

export default SkillsHeader;
