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
import PermissionGuard from "../../../../src/components/guards/PermissionGuard";
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
            ? "tab tab-active font-bold text-xs" // Remove capitalize from active
            : "tab text-xs" // Remove capitalize from inactive
        }
        style={{ textTransform: "capitalize" }} // Apply capitalize via inline style to the base text only
        onClick={() => onRoleSwitch(item)}
      >
        <span style={{ textTransform: "capitalize" }}>
          {item.label.split(" ").length === 1 ? item.label : item.label}
        </span>
        {item.label.split(" ").length === 1 && (
          <span style={{ textTransform: "none" }}>(s)</span>
        )}
      </span>
    );
  };

  // Sort roles by rank (memoized to prevent unnecessary resorting)
  const sortedRoles = useMemo(() => {
    return sortArray(roles, "rank");
  }, [roles]);

  return (
    <div
      role="tablist"
      className="w-5/6 tabs tabs-border text-primary flex flex-wrap"
    >
      {/* Map through sorted roles and render tabs with permission checks */}
      {sortedRoles.map((role) => (
        <PermissionGuard key={role._id} action="read" object={role.role}>
          {setContent(role)}
        </PermissionGuard>
      ))}
    </div>
  );
};

export default Tabs;
