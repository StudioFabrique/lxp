import React, { FC } from "react";
import { useSelector } from "react-redux";

import Badge from "../../utils/interfaces/badge";
import ImportBadges from "../skills/import-badges.component";
import BadgeItem from "./badge-item.component";

type Props = {
  selectedBadge?: any;
  onSubmitBadge: (badge: any) => void;
};

const BadgeList: FC<Props> = ({ onSubmitBadge }) => {
  const badgeList = useSelector((state: any) => state.parcoursSkills.badges);

  let content = (
    <div className="flex flex-col w-full gap-y-8 items-center">
      <ul className="flex items-center px-4 gap-x-2 mt-2">
        {badgeList.map((item: Badge) => (
          <li
            key={item.id}
            onClick={() => {
              onSubmitBadge(item);
            }}
          >
            <BadgeItem badge={item} />
          </li>
        ))}
      </ul>
      <ImportBadges onSubmit={onSubmitBadge} />
    </div>
  );
  console.log({ badgeList });

  return <>{content}</>;
};

const MemoizedBadgeList = React.memo(BadgeList);

export default MemoizedBadgeList;
