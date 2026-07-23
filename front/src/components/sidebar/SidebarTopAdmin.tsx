import {
  BookMarked,
  Component,
  FileEdit,
  GraduationCap,
  Home,
  Library,
  Rocket,
  Shield,
  Tag,
  User,
  Users,
} from "lucide-react";
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
  { key: "home", subject: "stats", label: "Accueil", icon: <Home /> },
  { key: "user", subject: "user", path: "user", label: "Utilisateurs", icon: <User /> },
  { key: "formation", subject: "formation", path: "formation", label: "Formations", icon: <GraduationCap /> },
  { key: "parcours", subject: "parcours", path: "parcours", label: "Parcours", icon: <Rocket /> },
  { key: "module", subject: "module", path: "module", label: "Modules", icon: <Component /> },
  { key: "course", subject: "course", path: "course", label: "Cours", icon: <BookMarked /> },
  { key: "lesson", subject: "lesson", path: "lesson", label: "Leçons", icon: <FileEdit /> },
  { key: "group", subject: "group", path: "group", label: "Groupes", icon: <Users /> },
  { key: "role", subject: "role", path: "roles", label: "Rôles", icon: <Shield /> },
  { key: "tag", subject: "tag", path: "tags", label: "Tags", icon: <Tag /> },
  { key: "mediatheque", subject: "mediatheque", path: "mediatheque", label: "Médiathèque", icon: <Library /> },
  { key: "resource", subject: "resource", path: "resources", label: "Ressources supplémentaires", icon: <FileEdit /> },
];

const SidebarTopAdmin = ({ currentRoute }: SharedSideBarProps) => (
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

export default SidebarTopAdmin;
