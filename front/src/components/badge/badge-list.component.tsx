import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Badge from "../../utils/interfaces/badge";
import ImportBadges from "../skills/import-badges.component";
import BadgeItem from "./badge-item.component";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";

type Props = {
  selectedBadge?: any;
  onSubmitBadge: (badge: any) => void;
};

const BadgeList: FC<Props> = ({ onSubmitBadge }) => {
  const badgeList = useSelector((state: any) => state.parcoursSkills.badges);
  const selectedBadge = useSelector(
    (state: any) => state.parcoursSkills.selectedBadge
  );
  const dispatch = useDispatch();

  useEffect(() => {
    onSubmitBadge(selectedBadge);
  }, [selectedBadge, onSubmitBadge]);

  let content = (
    <div className="flex flex-col w-full gap-y-8 items-center">
      <ul className="flex items-center px-4 gap-x-2 mt-2">
        {badgeList.map((item: Badge) => (
          <li
            key={item.id}
            onClick={() => {
              dispatch(parcoursSkillsAction.setSelectedBadge(item.id));
            }}
          >
            <BadgeItem badge={item} />
          </li>
        ))}
      </ul>
      <ImportBadges />
    </div>
  );
  console.log({ badgeList });

  return <>{content}</>;
};

const MemoizedBadgeList = React.memo(BadgeList);

export default MemoizedBadgeList;
