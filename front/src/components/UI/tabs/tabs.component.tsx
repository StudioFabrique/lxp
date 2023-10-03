import { FC } from "react";
import toTitleCase from "../../../utils/toTitleCase";
import Role from "../../../utils/interfaces/role";
import Can from "../can/can.component";

const Tabs: FC<{
  role: Role;
  roles: Array<Role>;
  onRoleSwitch: (role: Role) => void;
}> = ({ role, roles, onRoleSwitch }) => {
  const setContent = (item: Role) => {
    return (
      <li
        className={
          role.role === item.role
            ? "tab tab-lifted tab-active font-bold"
            : "tab tab-lifted"
        }
        onClick={() => onRoleSwitch(item)}
      >
        {`${toTitleCase(item.label)}s`}
      </li>
    );
  };

  return (
    <ul className="flex gap-x-1">
      {roles.map((role) => (
        <Can key={role._id} action="read" subject={role.role}>
          {setContent(role)}
        </Can>
      ))}
    </ul>
  );
};
export default Tabs;
