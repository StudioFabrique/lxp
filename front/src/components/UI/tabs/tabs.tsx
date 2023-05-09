import React, { FC } from "react";
import toTitleCase from "../../../utils/toTitleCase";

const Tabs: FC<{
  role: string;
  roles: Array<string>;
  onRoleSwitch: (role: string) => void;
}> = ({ role, roles, onRoleSwitch }) => {
  const handleTabClick = (newRole: string) => {
    onRoleSwitch(newRole);
  };

  let content = (
    <ul className="flex">
      {roles.map((item) => (
        <li key={item}>
          <p
            className={
              role === item ? "tab tab-lifted tab-active" : "tab tab-lifted"
            }
            onClick={() => handleTabClick(item)}
          >
            {`${toTitleCase(item)}s`}
          </p>
        </li>
      ))}
    </ul>
  );

  return <>{content}</>;
};

export default Tabs;
