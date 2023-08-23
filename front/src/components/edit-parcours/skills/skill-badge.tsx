import { FC } from "react";

import TrophyIcon from "../../UI/svg/trophy-icon.component";

type Props = {
  badge?: string;
};

const SkillBadge: FC<Props> = ({ badge }) => {
  return (
    <div className="btn btn-lg btn-circle rounded-lg bg-secondary/20 hover:bg-secondary/20 hover:cursor-default border-none no-animation">
      {badge ? (
        <img
          className="w-full h-full p-2"
          src={badge}
          alt="illustration badge"
        />
      ) : (
        <div className="text-primary">
          <TrophyIcon />
        </div>
      )}
    </div>
  );
};

export default SkillBadge;
