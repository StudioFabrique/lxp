import { FC, useState } from "react";
import { useDispatch } from "react-redux";

import BadgeList from "./badge-list.component";
import Badge from "../../utils/interfaces/badge";
import CreateBadge from "./create-badge-drawer";
import BadgeValidation from "./badge-validation.component";
import { parcoursAction } from "../../store/redux-toolkit/parcours";

type Props = {
  badge: Badge;
  onSubmitNewBadge: (newBadge: Badge) => void;
};

const BadgeUpdate: FC<Props> = ({ badge, onSubmitNewBadge }) => {
  const [updatedBadge, setUpdatedBadge] = useState<Badge | null>(badge);
  const dispatch = useDispatch();

  console.log("toto", badge);

  const submitNewBadge = (newBadge: Badge) => {
    if (newBadge && newBadge.title) {
      onSubmitNewBadge(newBadge);
    } else {
      setUpdatedBadge(newBadge);
    }
  };

  const validateBadge = (validBadge: Badge) => {
    let newBadge = {
      ...updatedBadge!,
      title: validBadge.title,
      description: validBadge.description,
    };
    dispatch(parcoursAction.validateBadge(newBadge));
    submitNewBadge(newBadge);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div>Choisir un nouveau badge</div>
      <BadgeList selectedBadge={updatedBadge} onSubmitBadge={setUpdatedBadge} />
      {updatedBadge ? (
        <div className="my-4">
          {!updatedBadge.title ? (
            <div>Veuillez valider le nouveau badge svp</div>
          ) : null}
          <BadgeValidation
            badge={updatedBadge}
            onValidateBadge={validateBadge}
          />
        </div>
      ) : null}
      <div className="divider my-8">Créer un nouveau badge</div>
      <CreateBadge />
    </div>
  );
};

export default BadgeUpdate;
