/**
 * DropDownRoles - A component for managing role assignments in bulk
 *
 * This component displays a list of available roles that can be assigned to selected users.
 * It allows for adding or removing roles from multiple users at once through a checkbox interface.
 * Only compatible roles based on rank are shown as options.
 *
 * @param {Object} props - Component props
 * @param {Role} props.roleTab - The currently active role tab
 * @param {string} props.drawerId - ID of the drawer element to control visibility
 * @param {Function} props.onGroupRolesChange - Callback function when roles are updated
 *
 * @example
 * ```tsx
 * <DropDownRoles
 *   roleTab={currentRole}
 *   drawerId="role-drawer"
 *   onGroupRolesChange={handleUpdateUserRoles}
 * />
 * ```
 */
import React, { FC, useContext, useEffect, useState } from "react";
import Role from "../../../utils/interfaces/role";
import { hasRole } from "../../../utils/hasRole";
import { DrawerContext } from "../../../store/drawer.store";
import { Context } from "../../../store/context.store";
import User from "../../../utils/interfaces/user";

const DropDownRoles: FC<{
  userToUpdate?: User;
  roleTab: Role;
  drawerId: string;
  onGroupRolesChange: (updatedRoles: Array<Role>) => void;
}> = (props) => {
  // State to track selected roles for bulk assignment
  const [newRoles, setNewRoles] = useState<Array<Role>>([]);

  console.log("NEW ROLES", newRoles);
  console.log("ROLE TAB", props.userToUpdate?.roles);

  // Access global roles and drawer state from context
  const { roles } = useContext(Context);
  const { isDrawerOpen } = useContext(DrawerContext);

  // Toggle role selection in the multi-select interface
  const handleSetNewRoles = (newRole: Role) => {
    if (newRoles.find((role) => role._id === newRole._id)) {
      // Remove role if already selected
      const updatedNewRoles = newRoles.filter(
        (role) => role._id !== newRole._id
      );
      setNewRoles(updatedNewRoles);
    } else {
      // Add role if not selected
      setNewRoles((prevNewRoles) => [...prevNewRoles, newRole]);
    }
  };

  // Handle submission of role changes
  const handleSubmitChange = () => {
    // Pass selected roles to parent component
    props.onGroupRolesChange(newRoles);
    // Reset local state
    setNewRoles([]);
    // Close the drawer
    document.getElementById(props.drawerId)?.click();
  };

  // Initialize roles when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      setNewRoles([props.roleTab]);
    }
  }, [isDrawerOpen, props.roleTab]);

  // Reset roles when active tab changes
  useEffect(() => {
    setNewRoles([props.roleTab]);
  }, [props.roleTab]);

  return (
    <>
      <p className="mb-4">
        Liste des rôles qui peuvent être ajoutés aux utilisateurs sélectionnés
      </p>
      <ul className="flex flex-col">
        {roles.map((role) => (
          <React.Fragment key={role._id}>
            {/* Filter roles based on compatibility:
                - Exclude system roles (everything)
                - Exclude interface roles
                - Group by rank (admin & teacher vs regular users) */}
            {role.role !== "everything" &&
            !role.role.startsWith("interface") &&
            ((role.rank > 2 && props.roleTab.rank > 2) ||
              (role.rank <= 2 && props.roleTab.rank <= 2)) ? (
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
            ) : null}
          </React.Fragment>
        ))}
        <p className="my-4">
          Attention les rôles sélectionnés deviendront les rôles des
          utilisateurs.
        </p>
        <button
          className="btn btn-primary mt-4"
          onMouseDown={handleSubmitChange}
        >
          Valider
        </button>
      </ul>
    </>
  );
};

export default DropDownRoles;
