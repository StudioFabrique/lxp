import { FC, useContext } from "react";
import toTitleCase from "../../../utils/toTitleCase";
import Role from "../../../utils/interfaces/role";
import { Context } from "../../../store/context.store";

const Tabs: FC<{
  userRole: Role;
  role: Role;
  roles: Array<Role>;
  onRoleSwitch: (role: Role) => void;
}> = ({ userRole, role, roles, onRoleSwitch }) => {
  const { user } = useContext(Context);
  console.log("user", user);
  console.log("roles", roles);

  const handleTabClick = (newRole: Role) => {
    onRoleSwitch(newRole);
  };

  const setContent = (item: Role) => {
    return (
      <p
        className={
          role.rank === item.rank
            ? "tab tab-lifted tab-active"
            : "tab tab-lifted"
        }
        onClick={() => handleTabClick(item)}
      >
        {`${toTitleCase(item.label)}s`}
      </p>
    );
  };

  return (
    <ul className="flex">
      {roles.map((item) => (
        <li key={item._id}>
          {userRole.rank <= 1
            ? setContent(item)
            : item.rank > user!.roles[0].rank
            ? setContent(item)
            : null}
        </li>
      ))}
    </ul>
  );
};

export default Tabs;
