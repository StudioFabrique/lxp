import { FC } from "react";
import Role from "../../../utils/interfaces/role";
import Can from "../can/can.component";

const Tabs: FC<{
  role: Role;
  roles: Array<Role>;
  onRoleSwitch: (role: Role) => void;
}> = ({ role, roles, onRoleSwitch }) => {
  const setContent = (item: Role) => {
    return (
      <span
        className={
          role.role === item.role
            ? "tab tab-active font-bold capitalize"
            : "tab capitalize"
        }
        onClick={() => onRoleSwitch(item)}
      >
        {item.label}
      </span>
    );
  };

  return (
    <div role="tablist" className="tabs tabs-border text-primary">
      {roles.map((role) => (
        <Can key={role._id} action="read" object={role.role}>
          {setContent(role)}
        </Can>
      ))}
    </div>
  );
};
export default Tabs;
