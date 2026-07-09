import { Dispatch, SetStateAction, useState } from "react";

const roleTypes = [
  { name: "administrateur", rank: 1 },
  { name: "équipe pédagogique", rank: 2 },
  { name: "apprenant", rank: 3 },
  { name: "visiteur", rank: 4 },
];

const RoleTypeSelector = ({
  currentRoleType,
  onSetCurrentRoleType,
  editMode,
  disabled,
}: {
  currentRoleType: number;
  onSetCurrentRoleType: Dispatch<SetStateAction<number>>;
  editMode?: boolean;
  disabled?: boolean;
}) => {
  const [showAlertRoleType, setShowAlertRoleType] = useState(false);

  return (
    <div className="flex flex-col gap-1 relative">
      <select
        className="w-full select select-sm border border-neutral/50 focus:outline-none capitalize"
        name="menu"
        id="menu"
        value={currentRoleType}
        onChange={(e) => {
          const found = roleTypes.find(
            (rt) => e.currentTarget.value === rt.rank.toString(),
          );
          onSetCurrentRoleType((_) => found?.rank ?? currentRoleType);
        }}
        onFocus={() => setShowAlertRoleType(true)}
        onBlur={() => setShowAlertRoleType(false)}
        disabled={disabled}
      >
        {roleTypes.map((item) => (
          <option key={item.rank} value={item.rank}>
            {item.name}
          </option>
        ))}
      </select>
      {showAlertRoleType && editMode && (
        <div className="absolute top-full mt-2 bg-base-100 p-2 rounded-lg shadow-lg border border-error w-64 text-xs text-error select-none">
          La modification du modèle de rôle remplacera automatiquement les
          permissions actuelles
        </div>
      )}
    </div>
  );
};

export default RoleTypeSelector;
