import { FC } from "react";

import Badge from "../../utils/interfaces/badge";
import badgeImg from "../../assets/images/tmp/badge-react.png";

type Props = {
  badgeList: Array<Badge>;
  onSubmitBadge: (badge: Badge) => void;
};

const BadgeList: FC<Props> = ({ badgeList, onSubmitBadge }) => {
  const handleBadgeSelect = (badge: Badge) => {
    onSubmitBadge(badge);
  };

  let content = (
    <>
      {badgeList.map((item) => (
        <li key={item.id} onClick={() => handleBadgeSelect(item)}>
          <span>
            <img className="w-6 h-6" src={badgeImg} alt={item.title} />
            <p>{item.title}</p>
          </span>
        </li>
      ))}
    </>
  );

  return <>{content}</>;
};

export default BadgeList;
