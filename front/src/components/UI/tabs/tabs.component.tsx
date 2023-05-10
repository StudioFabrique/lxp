import { FC, useContext } from "react";
import toTitleCase from "../../../utils/toTitleCase";
import Role from "../../../utils/interfaces/role";
import { Context } from "../../../store/context.store";

const Tabs: FC<{
  role: Role;
  roles: Array<Role>;
  onRoleSwitch: (role: Role) => void;
}> = ({ role, roles, onRoleSwitch }) => {
  const { user } = useContext(Context);
  console.log("user", user);
  console.log("roles", roles);

  const handleTabClick = (newRole: Role) => {
    onRoleSwitch(newRole);
  };

  let content = (
    <ul className="flex">
      {roles.map((item) => (
        <li key={item._id}>
          {item.rank > user!.roles[0].rank ? (
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
          ) : null}
        </li>
      ))}
    </ul>
  );

  return <>{content}</>;
};

export default Tabs;
