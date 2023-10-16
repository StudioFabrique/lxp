import { FC } from "react";
import { IRoleItem } from "../../../views/role/role";

const RoleSelector: FC<{
  roles: IRoleItem[];
  currentRole: string;
  onChangeRole: (role: string) => void;
}> = ({ roles, currentRole, onChangeRole }) => {
  return roles ? (
    <select
      className="w-full select select-sm border border-neutral/50 focus:outline-none"
      name="menu"
      id="menu"
      value={currentRole}
      onChange={(e) => onChangeRole(e.currentTarget.value)}
    >
      {roles.map((item: any) => (
        <option className="capitalize text-xs" key={item._id} value={item.role}>
          {item.role}
        </option>
      ))}
    </select>
  ) : null;
};

export default RoleSelector;
