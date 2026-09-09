import SidebarItem from "./SidebarItem";
import PermissionGuard from "../guards/PermissionGuard";
import { sidebarItems } from "../../config/sidebarItems";
import { sidebarListClassName } from "./sidebar-styles";

type SharedSideBarProps = { currentRoute: string[] };

const SidebarTopStudent = ({ currentRoute }: SharedSideBarProps) => (
  <ul className={sidebarListClassName}>
    {sidebarItems.student.map((item) => {
      const Icon = item.icon;

      return (
        <PermissionGuard key={item.key} action="read" object={item.subject}>
          <SidebarItem
            currentRoute={currentRoute}
            itemPath={item.path}
            icon={<Icon className="w-4" />}
            linkTo={`/${currentRoute[0]}/${item.path}`}
            tooltipText={item.label}
          >
            {item.label}
          </SidebarItem>
        </PermissionGuard>
      );
    })}
  </ul>
);

export default SidebarTopStudent;
