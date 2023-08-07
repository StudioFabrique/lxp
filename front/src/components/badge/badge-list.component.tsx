import React, { FC } from "react";
import { useSelector } from "react-redux";

import Badge from "../../utils/interfaces/badge";
import ImportBadges from "../skills/import-badges.component";
import BadgeItem from "./badge-item.component";

type Props = {
  selectedBadge?: any;
  onSubmitBadge: (badge: any) => void;
};

const BadgeList: FC<Props> = ({ selectedBadge, onSubmitBadge }) => {
  const badgeList = useSelector((state: any) => state.parcoursSkills.badges);

  let content = (
    <ul className="grid grid-cols-5 px-4 gap-x-2 gap-y-2 mt-2">
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
      <ImportBadges />
    </ul>
  );

  return <>{content}</>;
};

const MemoizedBadgeList = React.memo(BadgeList);

export default MemoizedBadgeList;
