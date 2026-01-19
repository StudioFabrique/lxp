import SidebarItem from "./sidebar-parts/sidebar-item";
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

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopAdmin = ({ currentRoute }: SharedSideBarProps) => {
  const sidebarItems = [
    <SidebarItem
      key="sidebar"
      itemPath={undefined}
      currentRoute={currentRoute}
      icon={<Home className="w-4" />}
      linkTo={`/${currentRoute[0]}`}
      tooltipText="Accueil"
    >
      Accueil
    </SidebarItem>,
    <SidebarItem
      key="user"
      currentRoute={currentRoute}
      itemPath={"user"}
      icon={<User className="w-4" />}
      linkTo={`/${currentRoute[0]}/user`}
      tooltipText="Utilisateurs"
    >
      Utilisateurs
    </SidebarItem>,
    <SidebarItem
      key="formation"
      currentRoute={currentRoute}
      itemPath={"formation"}
      icon={<GraduationCap className="w-4" />}
      linkTo={`/${currentRoute[0]}/formation`}
      tooltipText="Formations"
    >
      Formations
    </SidebarItem>,
    <SidebarItem
      key="parcours"
      currentRoute={currentRoute}
      itemPath={"parcours"}
      icon={<Rocket className="w-4" />}
      linkTo={`/${currentRoute[0]}/parcours`}
      tooltipText="Parcours"
    >
      Parcours
    </SidebarItem>,
    <SidebarItem
      key="module"
      currentRoute={currentRoute}
      itemPath={"module"}
      icon={<Component className="w-4" />}
      linkTo={`/${currentRoute[0]}/module`}
      tooltipText="Modules"
    >
      Modules
    </SidebarItem>,
    <SidebarItem
      key="course"
      currentRoute={currentRoute}
      itemPath={"course"}
      icon={<BookMarked className="w-4" />}
      linkTo={`/${currentRoute[0]}/course`}
      tooltipText="Cours"
    >
      Cours
    </SidebarItem>,
    <SidebarItem
      key="lesson"
      currentRoute={currentRoute}
      itemPath={"lesson"}
      icon={<FileEdit className="w-4" />}
      linkTo={`/${currentRoute[0]}/lesson`}
      tooltipText="Leçons"
    >
      Leçons
    </SidebarItem>,
    <SidebarItem
      key="group"
      currentRoute={currentRoute}
      itemPath={"group"}
      icon={<Users className="w-4" />}
      linkTo={`/${currentRoute[0]}/group`}
      tooltipText="Groupes"
    >
      Groupes
    </SidebarItem>,
    <SidebarItem
      key="role"
      currentRoute={currentRoute}
      itemPath={"roles"}
      icon={<Shield className="w-4" />}
      linkTo={`/${currentRoute[0]}/roles`}
      tooltipText="Rôles"
    >
      Rôles
    </SidebarItem>,
    <SidebarItem
      key="tag"
      currentRoute={currentRoute}
      itemPath={"tags"}
      icon={<Tag className="w-4" />}
      linkTo={`/${currentRoute[0]}/tags`}
      tooltipText="Tags"
    >
      Tags
    </SidebarItem>,
    <SidebarItem
      key="mediatheque"
      currentRoute={currentRoute}
      itemPath={"mediatheque"}
      icon={<Library className="w-4" />}
      linkTo={`/${currentRoute[0]}/mediatheque`}
      tooltipText="Médiathèque"
    >
      Médiathèque
    </SidebarItem>,
    <SidebarItem
      key="resource"
      currentRoute={currentRoute}
      itemPath={"resources"}
      icon={<FileEdit className="w-4" />}
      linkTo={`/${currentRoute[0]}/resources`}
      tooltipText="Ressources supplémentaires"
    >
      Ressources supplémentaires
    </SidebarItem>,
  ];

  return <ul className={`flex flex-col px-2 gap-1`}>{sidebarItems}</ul>;
};

export default SidebarTopAdmin;
