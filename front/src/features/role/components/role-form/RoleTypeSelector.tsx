import { type Dispatch, type SetStateAction, useId } from "react";
import { roleModels } from "../../helpers/role-models";
import RoleRadioCard from "../RoleRadioCard";

const RoleTypeSelector = ({
  currentRoleType,
  onSetCurrentRoleType,
  editMode,
  disabled,
  minimumRank,
  id = "role-model",
}: {
  currentRoleType: number;
  onSetCurrentRoleType: Dispatch<SetStateAction<number>>;
  editMode?: boolean;
  disabled?: boolean;
  minimumRank: number;
  id?: string;
}) => {
  const radioGroupId = useId();
  const availableRoleTypes = roleModels.filter(
    ({ rank }) => rank > minimumRank,
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        aria-describedby={editMode && !disabled ? `${id}-warning` : undefined}
        id={id}
      >
        {availableRoleTypes.map(({ name, rank }) => (
          <RoleRadioCard
            key={rank}
            name={radioGroupId}
            value={rank}
            rank={rank}
            label={name}
            checked={currentRoleType === rank}
            onChange={() => onSetCurrentRoleType(rank)}
            disabled={disabled}
          />
        ))}
      </div>
      {editMode && !disabled && (
        <p id={`${id}-warning`} className="text-xs text-warning">
          La modification du modèle de rôle remplacera automatiquement les
          permissions actuelles
        </p>
      )}
    </div>
  );
};

export default RoleTypeSelector;
