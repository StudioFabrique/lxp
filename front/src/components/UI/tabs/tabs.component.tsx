/**
 * Tabs - A role-based tab navigation component
 *
 * This component renders a series of tabs representing different user roles.
 * It highlights the currently selected role tab and handles role switching.
 * Tabs are only shown to users who have appropriate permissions to view that role.
 *
 * @param {Object} props - Component props
 * @param {Role} props.role - The currently selected role
 * @param {Array<Role>} props.roles - Array of all available roles to display as tabs
 * @param {Function} props.onRoleSwitch - Callback function triggered when a role tab is clicked
 *
 * @example
 * ```tsx
 * <Tabs
 *   role={currentRole}
 *   roles={availableRoles}
 *   onRoleSwitch={handleRoleChange}
 * />
 * ```
 */
import { FC, useMemo } from "react";
import Role from "../../../utils/interfaces/role";
import Can from "../can/can.component";
import { sortArray } from "../../../utils/sortArray";

const Tabs: FC<{
  role: Role;
  roles: Array<Role>;
  onRoleSwitch: (role: Role) => void;
}> = ({ role, roles, onRoleSwitch }) => {
  // Helper function to render a single tab with proper styling based on selection state
  const setContent = (item: Role) => {
    return (
      <span
        className={
          role.role === item.role
            ? "tab tab-active font-bold capitalize text-xs" // Active tab styling
            : "tab capitalize text-xs" // Inactive tab styling
        }
        onClick={() => onRoleSwitch(item)}
      >
        {item.label}
      </span>
    );
  };

  // Sort roles by rank (memoized to prevent unnecessary resorting)
  const sortedRoles = useMemo(() => {
    return sortArray(roles, "rank");
  }, [roles]);

  return (
    <div role="tablist" className="tabs tabs-border text-primary">
      {/* Map through sorted roles and render tabs with permission checks */}
      {sortedRoles.map((role) => (
        <Can key={role._id} action="read" object={role.role}>
          {setContent(role)}
        </Can>
      ))}
    </div>
  );
};

export default Tabs;
