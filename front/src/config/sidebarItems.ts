import {
  BookMarked,
  Calendar,
  ClipboardCheck,
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
  teacherOnly?: boolean;
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
      key: "group",
      subject: "group",
      path: "group",
      label: "Groupes",
      icon: Users,
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
      key: "calendar",
      subject: "course",
      path: "calendrier",
      label: "Calendrier",
      icon: Calendar,
    },
    {
      key: "evaluations",
      subject: "course",
      path: "teacher/evaluations",
      label: "Évaluations",
      icon: ClipboardCheck,
      teacherOnly: true,
    },
    {
      key: "resource",
      subject: "resource",
      path: "resources",
      label: "Ressources supplémentaires",
      icon: FileEdit,
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
      key: "assignments",
      subject: "cursus",
      path: "remises-evaluations",
      label: "Remises & évaluations",
      icon: ClipboardCheck,
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
  const [layout, ...routeSegments] = pathname.split("/").filter(Boolean);

  if (!layout || routeSegments.length === 0 || !isSidebarLayout(layout)) {
    return undefined;
  }

  const route = routeSegments.join("/");
  return sidebarItems[layout].find(
    (item) => route === item.path || route.startsWith(`${item.path}/`),
  );
};
