import { FC } from "react";

import Badge from "../../utils/interfaces/badge";
import TrophyIcon from "../UI/svg-icons/trophy-icon.component";

type Props = {
  badge?: string;
};

const SkillBadge: FC<Props> = ({ badge }) => {
  return (
    <div className="btn bg-secondary/20 hover:bg-secondary/20 hover:cursor-default border-none no-animation">
      {badge ? (
        <img className="w-6 h-6" src={badge} alt="illustration badge" />
      ) : (
        <div className="text-primary">
          <TrophyIcon />
        </div>
      )}
    </div>
  );
};

export default SkillBadge;
