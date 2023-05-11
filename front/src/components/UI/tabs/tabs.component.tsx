import { FC, useContext } from "react";
import toTitleCase from "../../../utils/toTitleCase";
import Role from "../../../utils/interfaces/role";
import { Context } from "../../../store/context.store";
import Can from "../can/can.component";

const Tabs: FC<{
  role: Role;
  roles: Array<Role>;
  onRoleSwitch: (role: Role) => void;
}> = ({ role, roles, onRoleSwitch }) => {
  const { user } = useContext(Context);

  console.log(user!.roles);

  const handleTabClick = (newRole: Role) => {
    onRoleSwitch(newRole);
  };

  const setContent = (item: Role) => {
    return (
      <p
        className={
          role.rank === item.rank
            ? "tab tab-lifted tab-active text-green-500 font-bold"
            : "tab tab-lifted text-blue-500 font-bold"
        }
        onClick={() => handleTabClick(item)}
      >
        {`${toTitleCase(item.label)}s`}
      </p>
    );
  };

  return (
    <ul className="flex">
      {roles.map((role) => (
        <Can key={role._id} action="read" subject={role.role}>
          {setContent(role)}
        </Can>
      ))}
    </ul>
  );
};
export default Tabs;
