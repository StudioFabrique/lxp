import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
} from "react";
import { IRoleItem } from "../../../views/role/role";

const RoleSelector: FC<{
  roles: IRoleItem[];
  currentRole: IRoleItem;
  onSetCurrentRole: Dispatch<SetStateAction<IRoleItem>>;
}> = ({ roles, currentRole, onSetCurrentRole }) => {
  const handleSelect: ChangeEventHandler<HTMLSelectElement> = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const newRole = roles.find((role) => e.currentTarget.value === role.role);
    onSetCurrentRole((previousRole) => newRole ?? previousRole);
  };

  return roles ? (
    <select
      className="select select-sm border border-neutral/50 focus:outline-none"
      name="menu"
      id="menu"
      value={currentRole.role}
      onChange={handleSelect}
    >
      {roles.map((item) => (
        <option className="capitalize text-xs" key={item._id} value={item.role}>
          {item.role} {item.role === "admin" && "(mon rôle)"}
        </option>
      ))}
    </select>
  ) : null;
};

export default RoleSelector;
