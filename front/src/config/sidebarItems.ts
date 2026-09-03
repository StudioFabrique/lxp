import {
  BookMarked,
  Calendar,
  Component,
  FileEdit,
  Home,
  Layers,
  Library,
  Rocket,
  Shield,
  Tag,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AppSubject } from "../rbac/ability";

export type SidebarLayout = "admin" | "student";

export type SidebarItemConfig = {
  key: string;
  subject: AppSubject;
  path: string;
  label: string;
  icon: LucideIcon;
};

export const sidebarItems: Record<SidebarLayout, SidebarItemConfig[]> = {
  admin: [
    {
      key: "home",
      subject: "stats",
      path: "dashboard",
      label: "Accueil",
      icon: Home,
    },
    {
      key: "user",
      subject: "user",
      path: "user",
      label: "Utilisateurs",
      icon: User,
    },
    {
      key: "parcours",
      subject: "parcours",
      path: "parcours",
      label: "Parcours",
      icon: Rocket,
    },
    {
      key: "module",
      subject: "module",
      path: "module",
      label: "Modules",
      icon: Component,
    },
    {
      key: "course",
      subject: "course",
      path: "course",
      label: "Cours",
      icon: BookMarked,
    },
    {
      key: "group",
      subject: "group",
      path: "group",
      label: "Groupes",
      icon: Users,
    },
    {
      key: "role",
      subject: "role",
      path: "roles",
      label: "Rôles",
      icon: Shield,
    },
    {
      key: "tag",
      subject: "tag",
      path: "tags",
      label: "Tags",
      icon: Tag,
    },
    {
      key: "mediatheque",
      subject: "mediatheque",
      path: "mediatheque",
      label: "Médiathèque",
      icon: Library,
    },
    {
      key: "resource",
      subject: "resource",
      path: "resources",
      label: "Ressources supplémentaires",
      icon: FileEdit,
    },
  ],
  student: [
    {
      key: "home",
      subject: "cursus",
      path: "dashboard",
      label: "Accueil",
      icon: Home,
    },
    {
      key: "parcours",
      subject: "parcours",
      path: "parcours",
      label: "Parcours",
      icon: Rocket,
    },
    {
      key: "calendar",
      subject: "cursus",
      path: "calendrier",
      label: "Calendrier",
      icon: Calendar,
    },
    {
      key: "resources",
      subject: "resource",
      path: "ressources",
      label: "Ressources supplémentaires",
      icon: Layers,
    },
  ],
};

const isSidebarLayout = (layout: string): layout is SidebarLayout =>
  layout === "admin" || layout === "student";

export const getSidebarItemForPath = (
  pathname: string,
): SidebarItemConfig | undefined => {
  const [layout, route] = pathname.split("/").filter(Boolean);

  if (!layout || !route || !isSidebarLayout(layout)) {
    return undefined;
  }

  return sidebarItems[layout].find((item) => item.path === route);
};
