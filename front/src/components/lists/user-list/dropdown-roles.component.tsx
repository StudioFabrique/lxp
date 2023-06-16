import React, { FC, useContext, useEffect, useState } from "react";
import Role from "../../../utils/interfaces/role";
import { Context } from "../../../store/context.store";
import Can from "../../UI/can/can.component";
import { hasRole } from "../../../utils/hasRole";
import { DrawerContext } from "../../../store/drawer.store";

const DropDownRoles: FC<{
  roleTab: Role;
  drawerId: string;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
}> = (props) => {
  const [newRoles, setNewRoles] = useState<Array<Role>>([]);
  const { roles } = useContext(Context);
  const { isDrawerOpen } = useContext(DrawerContext);

  const handleSetNewRoles = (newRole: Role) => {
    if (newRoles.find((role) => role._id === newRole._id)) {
      const updatedNewRoles = newRoles.filter(
        (role) => role._id !== newRole._id
      );
      setNewRoles(updatedNewRoles);
    } else {
      setNewRoles((prevNewRoles) => [...prevNewRoles, newRole]);
    }
  };

  const handleSubmitChange = () => {
    props.onGroupRolesChange(newRoles);
    setNewRoles([]);
    document.getElementById(props.drawerId)?.click();
  };

  useEffect(() => {
    if (isDrawerOpen) {
      setNewRoles([props.roleTab]);
    }
  }, [isDrawerOpen, props.roleTab]);

  useEffect(() => {
    setNewRoles([props.roleTab]);
  }, [props.roleTab]);

  return (
    <ul className="flex flex-col">
      {roles.map((role) => (
        <React.Fragment key={role._id}>
          {props.roleTab.rank === role.rank ? (
            <Can action={"update"} subject={role.role}>
              <li>
                <div className="flex gap-x-4">
                  <input
                    className="checkbox checkbox-primary"
                    type="checkbox"
                    checked={hasRole(role.role, newRoles)}
                    onChange={() => handleSetNewRoles(role)}
                  />
                  <p className="font-bold">{role.label}</p>
                </div>
              </li>
            </Can>
          ) : null}
        </React.Fragment>
      ))}
      <button className="btn btn-primary mt-4" onMouseDown={handleSubmitChange}>
        Valider
      </button>
    </ul>
  );
};

export default DropDownRoles;
