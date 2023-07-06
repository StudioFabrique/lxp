import { FC } from "react";
import BadgeList from "./badge-list.component";
import Badge from "../../utils/interfaces/badge";
import CreateBadge from "./create-badge-drawer";

type Props = {
  badge: Badge;
  onSubmitNewBadge: (newBadge: Badge) => void;
};

const BadgeUpdate: FC<Props> = ({ badge, onSubmitNewBadge }) => {
  const submitNewBadge = (newBadge: Badge) => {
    onSubmitNewBadge(newBadge);
  };

  return (
    <div>
      <BadgeList selectedBadge={badge} onSubmitBadge={submitNewBadge} />
      <div className="divider my-8">Choisir un nouveau badge</div>
      <CreateBadge />
    </div>
  );
};

export default BadgeUpdate;
