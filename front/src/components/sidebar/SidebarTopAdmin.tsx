import { useContext } from "react";

import SidebarItem from "./SidebarItem";
import PermissionGuard from "../guards/PermissionGuard";
import { sidebarItems } from "../../config/sidebarItems";
import { AuthContext } from "../../store/AuthProvider";
import { getModulesLabel } from "../../utils/helpers/user-role";

type SharedSideBarProps = { currentRoute: string[] };

const SidebarTopAdmin = ({ currentRoute }: SharedSideBarProps) => {
  const { user } = useContext(AuthContext);

  return (
    <ul className="flex flex-col px-2 gap-1">
      {sidebarItems.admin.map((item) => {
        const Icon = item.icon;
        const label =
          item.key === "module"
            ? getModulesLabel(user, item.label)
            : item.label;

        return (
          <PermissionGuard key={item.key} action="read" object={item.subject}>
            <SidebarItem
              currentRoute={currentRoute}
              itemPath={item.path}
              icon={<Icon className="w-4" />}
              linkTo={`/${currentRoute[0]}/${item.path}`}
              tooltipText={label}
            >
              {label}
            </SidebarItem>
          </PermissionGuard>
        );
      })}
    </ul>
  );
};

export default SidebarTopAdmin;
