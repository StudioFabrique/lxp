import React, { FC } from "react";
import Badge from "../../utils/interfaces/badge";

type Props = {
  badge: Badge;
};

const BadgeItem: FC<Props> = ({ badge }) => {
  let badgeStyle =
    "w-[75px] h-[75px] bg-secondary/20 p-4 rounded-xl flex justify-center items-center hover:scale-105 hover:bg-secondary/50 border border-primary  ";

  return (
    <div className={badgeStyle}>
      <img className="w-8 h-8" src={badge.image} alt="illustation" />
    </div>
  );
};

export default BadgeItem;
