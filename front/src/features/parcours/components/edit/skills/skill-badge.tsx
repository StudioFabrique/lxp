import { FC } from "react";

import TrophyIcon from "../../../../../../src/components/UI/svg/trophy-icon.component";

type Props = {
  badge?: string;
};

const SkillBadge: FC<Props> = ({ badge }) => {
  return (
    <div className="flex min-h-10 w-10 shrink-0 items-center justify-center self-stretch rounded-lg bg-secondary/10 hover:cursor-default">
      {badge ? (
        <img
          className="size-full object-contain p-1"
          src={badge}
          alt="illustration badge"
        />
      ) : (
        <div className="w-6 h-6 text-primary">
          <TrophyIcon />
        </div>
      )}
    </div>
  );
};

export default SkillBadge;
