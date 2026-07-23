import { Calendar, Home, Layers, Rocket } from "lucide-react";
import SidebarItem from "./SidebarItem";
import PermissionGuard from "../guards/PermissionGuard";
import { AppSubject } from "../../rbac/ability";

type SharedSideBarProps = { currentRoute: string[] };

const items: {
  key: string;
  subject: AppSubject;
  path?: string;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "home", subject: "cursus", label: "Accueil", icon: <Home /> },
  { key: "parcours", subject: "parcours", path: "parcours", label: "Parcours", icon: <Rocket /> },
  { key: "calendar", subject: "cursus", path: "calendrier", label: "Calendrier", icon: <Calendar /> },
  { key: "resources", subject: "resource", path: "ressources", label: "Ressources supplémentaires", icon: <Layers /> },
];

const SidebarTopStudent = ({ currentRoute }: SharedSideBarProps) => (
  <ul className="flex flex-col px-2 gap-1">
    {items.map((item) => (
      <PermissionGuard key={item.key} action="read" object={item.subject}>
        <SidebarItem
          currentRoute={currentRoute}
          itemPath={item.path}
          icon={<span className="[&>svg]:w-4">{item.icon}</span>}
          linkTo={`/${currentRoute[0]}${item.path ? `/${item.path}` : ""}`}
          tooltipText={item.label}
        >
          {item.label}
        </SidebarItem>
      </PermissionGuard>
    ))}
  </ul>
);

export default SidebarTopStudent;
