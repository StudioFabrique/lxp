import { FC } from "react";

import Objective from "../../../../../../src/utils/interfaces/objective";
import EditIcon from "../../../../../../src/components/UI/svg/edit-icon";
import DeleteIcon from "../../../../../../src/components/UI/svg/delete-icon.component";
import { useRoleLabels } from "../../../../role/hooks/useRoleLabels";

type Props = {
  objective: Objective;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
  readOnly?: boolean;
};

const ObjectiveItem: FC<Props> = ({
  objective,
  onDelete,
  onUpdate,
  readOnly,
}) => {
  const { teamLabel } = useRoleLabels();
  const handleUpdate = () => {
    onUpdate(objective.id!);
  };

  return (
    <article className="flex items-stretch gap-x-2">
      {/* Hauteur minimale et non fixe : un objectif long passe à la ligne au lieu de déborder. */}
      <div className="flex min-h-12 min-w-0 flex-1 items-center rounded-lg bg-secondary/10 px-2 py-2">
        <p className="min-w-0 wrap-break-word first-letter:uppercase">{objective.description}</p>
      </div>
      {/* Mobile : les deux actions s'empilent, centrées sur la hauteur du texte, comme pour les compétences. */}
      <div className="flex shrink-0 flex-col items-center justify-center gap-2 md:flex-row">
        <button
          className="btn btn-primary btn-circle max-md:btn-sm rounded-lg"
          type="button"
          onClick={handleUpdate}
          aria-label="modification de l'objectif"
          disabled={readOnly}
          title={
            readOnly ? `Lecture seule pour le rôle « ${teamLabel} »` : undefined
          }
        >
          <div className="size-4 md:size-6">
            <EditIcon />
          </div>
        </button>
        <button
          className="btn btn-primary btn-circle max-md:btn-sm rounded-lg"
          onClick={() => onDelete(objective.id!)}
          aria-label="suppression de l'objectif"
          disabled={readOnly}
          title={
            readOnly ? `Lecture seule pour le rôle « ${teamLabel} »` : undefined
          }
        >
          <div className="size-4 md:size-6">
            <DeleteIcon />
          </div>
        </button>
      </div>
    </article>
  );
};

export default ObjectiveItem;
