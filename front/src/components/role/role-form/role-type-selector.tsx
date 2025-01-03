import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from "react";

const RoleTypeSelector: FC<{
  currentRoleType: number;
  onSetCurrentRoleType: Dispatch<SetStateAction<number>>;
  editMode?: boolean;
}> = ({ currentRoleType, onSetCurrentRoleType, editMode }) => {
  const [showAlertRoleType, setShowAlertRoleType] = useState<boolean>(false);

  const roleTypes = [
    { name: "administrateur", rank: 1 },
    { name: "formateur", rank: 2 },
    { name: "apprenant", rank: 3 },
    { name: "visiteur", rank: 4 },
  ];

  const handleSelect: ChangeEventHandler<HTMLSelectElement> = (
    e: ChangeEvent<HTMLSelectElement>,
  ) => {
    const newRoleType = roleTypes.find(
      (roleType) => e.currentTarget.value === roleType.rank.toString(),
    );
    onSetCurrentRoleType((previousRole) => newRoleType?.rank ?? previousRole);
  };

  return roleTypes ? (
    <div className="flex flex-col gap-1 relative">
      <select
        className="w-full select select-sm border border-neutral/50 focus:outline-none"
        name="menu"
        id="menu"
        value={currentRoleType}
        onChange={handleSelect}
        onFocus={() => setShowAlertRoleType(true)}
        onBlur={() => setShowAlertRoleType(false)}
      >
        {roleTypes.map((item) => (
          <option
            className="capitalize text-xs"
            key={item.rank}
            value={item.rank}
          >
            {item.name}
          </option>
        ))}
      </select>
      {showAlertRoleType && editMode && (
        <div className="absolute top-full mt-2 bg-base-100 p-2 rounded-lg shadow-lg border border-error w-64 text-xs text-error">
          Le changement de modèle de rôle écrasera les permissions existantes
        </div>
      )}
    </div>
  ) : null;
};

export default RoleTypeSelector;
