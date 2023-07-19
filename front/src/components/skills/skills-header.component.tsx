import { FC } from "react";
import { Link } from "react-router-dom";

import BadgeIcon from "../UI/svg-icons/badge-icon.component";
import ButtonNoDecorationIcon from "../UI/button-no-decoration-icon/button-no-decoration-icon.component";
import TrophyIcon from "../UI/svg-icons/trophy-icon.component";

type Props = {
  onImport: () => void;
};

const SkillsHeader: FC<Props> = ({ onImport }) => {
  return (
    <div className="w-full flex justify-between items-center">
      <h3 className="text-xl font-bold">Compétences</h3>
      <div className="flex items-center gap-x-8">
        <div className="text-primary">
          <ButtonNoDecorationIcon
            label="Importer des compétences"
            onClickEvent={onImport}
          >
            <TrophyIcon size={4} />
          </ButtonNoDecorationIcon>
        </div>
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
