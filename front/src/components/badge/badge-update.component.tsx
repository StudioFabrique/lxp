import { FC } from "react";
import BadgeList from "./badge-list.component";
import { useSelector } from "react-redux";
import Badge from "../../utils/interfaces/badge";

type Props = {
  badge: Badge;
  onSubmitNewBadge: (newBadge: Badge) => void;
};

const BadgeUpdate: FC<Props> = ({ badge, onSubmitNewBadge }) => {
  const badges = useSelector((state: any) => state.parcours.badges);

  const submitNewBadge = (newBadge: Badge) => {
    onSubmitNewBadge(newBadge);
  };

  const createBadge = () => {
    //document.getElementById("create-badge")?.click();
  };

  return (
    <BadgeList
      badgeList={badges}
      selectedBadge={badge}
      onSubmitBadge={submitNewBadge}
      onCreateBadge={createBadge}
    />
  );
};

export default BadgeUpdate;
