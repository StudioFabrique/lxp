import { FC } from "react";

import Badge from "../../utils/interfaces/badge";
import defaultImage from "../../assets/images/tmp/default.svg";

type Props = {
  badge: Badge;
};

const SkillBadge: FC<Props> = ({ badge }) => {
  return (
    <div className="btn bg-secondary/20 hover:bg-secondary/20 hover:cursor-default border-none no-animation">
      <img
        className="w-6 h-6"
        src={badge.image !== "default" ? badge.image : defaultImage}
        alt={badge.title}
      />
    </div>
  );
};

export default SkillBadge;

//  TODO: inclure les images
