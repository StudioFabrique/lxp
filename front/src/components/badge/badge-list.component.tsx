import React, { FC } from "react";

import Badge from "../../utils/interfaces/badge";
import badgeImg from "../../assets/images/tmp/badge-react.png";
import { useSelector } from "react-redux";

type Props = {
  selectedBadge?: Badge;
  onSubmitBadge: (badge: Badge) => void;
};

const BadgeList: FC<Props> = ({ selectedBadge, onSubmitBadge }) => {
  const badgeList = useSelector((state: any) => state.parcours.badges);

  const handleUpdateBadge = (newBadge: Badge) => {
    onSubmitBadge(newBadge);
  };

  console.log("list rendering");

  let badgeStyle =
    "w-[75px] h-[75px] bg-secondary/20 p-4 rounded-xl flex justify-center items-center hover:scale-105 hover:bg-secondary/50";

  const setBadgeStyle = (badgeId: number) => {
    if (selectedBadge) {
      return badgeId === selectedBadge.id
        ? badgeStyle + " border border-primary"
        : badgeStyle;
    } else {
      return badgeStyle;
    }
  };

  let content = (
    <>
      <ul className="grid grid-cols-5 px-4 gap-x-2 gap-y-2">
        {badgeList.map((item: Badge) => (
          <div
            className="tooltip hover:tooltip-open tooltip-bottom"
            data-tip={item.title}
            key={item.id}
          >
            <li onClick={() => handleUpdateBadge(item)}>
              <div className={setBadgeStyle(item.id)}>
                <img className="w-8 h-8" src={badgeImg} alt={item.title} />
              </div>
            </li>
          </div>
        ))}
      </ul>
    </>
  );

  return <>{content}</>;
};

const MemoizedBadgeList = React.memo(BadgeList);

export default MemoizedBadgeList;
