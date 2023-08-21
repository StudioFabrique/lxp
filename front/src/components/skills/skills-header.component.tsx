import { FC } from "react";

import ButtonNoDecorationIcon from "../UI/button-no-decoration-icon/button-no-decoration-icon.component";
import TrophyIcon from "../UI/svg/trophy-icon.component";

type Props = {
  onImport: () => void;
};

const SkillsHeader: FC<Props> = ({ onImport }) => {
  return (
    <div className="w-full flex justify-between items-center pr-2">
      <div className="text-primary hover:underline">
        <ButtonNoDecorationIcon
          label="Importer des compétences"
          onClickEvent={onImport}
        >
          <TrophyIcon size={4} />
        </ButtonNoDecorationIcon>
      </div>
    </div>
  );
};

export default SkillsHeader;
