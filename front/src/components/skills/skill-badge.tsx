import { FC } from "react";

import Badge from "../../utils/interfaces/badge";
import TrophyIcon from "../UI/svg-icons/trophy-icon.component";

type Props = {
  badge?: Badge;
};

const SkillBadge: FC<Props> = ({ badge }) => {
  return (
    <div className="btn bg-secondary/20 hover:bg-secondary/20 hover:cursor-default border-none no-animation">
      {badge ? (
        <img className="w-6 h-6" src={badge.image} alt={badge.title} />
      ) : (
        <div className="text-primary">
          <TrophyIcon />
        </div>
      )}
    </div>
  );
};

export default SkillBadge;
