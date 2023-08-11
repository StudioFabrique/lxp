import React, { FC, useState } from "react";

import Badge from "../../utils/interfaces/badge";
import ImportBadges from "../skills/import-badges.component";
import BadgeItem from "./badge-item.component";

type Props = {
  selectedBadge?: any;
  onSubmitBadge: (badge: any) => void;
};

const BadgeList: FC<Props> = ({ onSubmitBadge }) => {
  const [badge, setBadge] = useState<Badge | null>(null);

  const handleSubmitBadge = (newBadge: Badge) => {
    setBadge(newBadge);
    onSubmitBadge(newBadge);
  };

  let content = (
    <div className="flex flex-col w-full gap-y-8 items-center">
      {badge ? <BadgeItem badge={badge} /> : null}
      <ImportBadges onSubmit={handleSubmitBadge} />
    </div>
  );

  return <>{content}</>;
};

const MemoizedBadgeList = React.memo(BadgeList);

export default MemoizedBadgeList;
