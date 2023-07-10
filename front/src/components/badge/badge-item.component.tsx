import React, { FC } from "react";
import Badge from "../../utils/interfaces/badge";

type Props = {
  badge: any;
  isSelected: boolean;
  onUpdateBadge: (newBadge: Badge) => void;
};

const BadgeItem: FC<Props> = ({ badge, isSelected, onUpdateBadge }) => {
  let badgeStyle =
    "w-[75px] h-[75px] bg-secondary/20 p-4 rounded-xl flex justify-center items-center hover:scale-105 hover:bg-secondary/50";

  const setBadgeStyle = () => {
    return isSelected ? badgeStyle + " border border-primary" : badgeStyle;
  };

  return (
    <div
      className="tooltip hover:tooltip-open tooltip-bottom"
      data-tip={badge.title}
    >
      <li onClick={() => onUpdateBadge(badge)}>
        <div className={setBadgeStyle()}>
          <img className="w-8 h-8" src={badge.image} alt={badge.title} />
        </div>
      </li>
    </div>
  );
};

export default BadgeItem;
