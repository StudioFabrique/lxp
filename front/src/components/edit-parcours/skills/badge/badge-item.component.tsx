import { FC } from "react";

import Badge from "../../../../utils/interfaces/badge";

type Props = {
  badge: Badge;
};

const BadgeItem: FC<Props> = ({ badge }) => {
  console.log({ badge });

  let badgeStyle =
    "border border-primary w-[75px] h-[75px] bg-secondary/20 p-2 rounded-xl flex justify-center items-center hover:scale-105 hover:bg-secondary/50";
  console.log(badge.image);

  return (
    <div className={badgeStyle}>
      <img className="w-full h-full" src={badge.image} alt="illustation" />
    </div>
  );
};

export default BadgeItem;
