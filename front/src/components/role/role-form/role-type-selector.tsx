import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
} from "react";

const RoleTypeSelector: FC<{
  currentRoleType: number;
  onSetCurrentRoleType: Dispatch<SetStateAction<number>>;
}> = ({ currentRoleType, onSetCurrentRoleType }) => {
  const roleTypes = [
    { name: "administrateur", rank: 1 },
    { name: "formateur", rank: 2 },
    { name: "apprenant", rank: 3 },
    { name: "visiteur", rank: 4 },
  ];

  const handleSelect: ChangeEventHandler<HTMLSelectElement> = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const newRoleType = roleTypes.find(
      (roleType) => e.currentTarget.value === roleType.rank.toString()
    );
    onSetCurrentRoleType(
      (previousRole: any) => newRoleType?.rank ?? previousRole
    );
  };

  return roleTypes ? (
    <select
      className="w-[60%] select select-sm border border-neutral/50 focus:outline-none"
      name="menu"
      id="menu"
      value={currentRoleType}
      onChange={handleSelect}
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
  ) : null;
};

export default RoleTypeSelector;
