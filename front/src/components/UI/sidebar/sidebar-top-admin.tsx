import CourseIcon from "../svg/course-icon";
import GroupIcon from "../svg/group-icon";
import SidebarItem from "./sidebar-parts/sidebar-item";
import {
  BookMarked,
  Component,
  FileEdit,
  Home,
  Library,
  Rocket,
  Shield,
  Tag,
  User,
} from "lucide-react";

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopAdmin = ({ currentRoute }: SharedSideBarProps) => {
  const sidebarItems = [
    <SidebarItem
      key="formation"
      currentRoute={currentRoute}
      itemPath={"formation"}
      icon={<BookMarked className="w-4" />}
      linkTo={`/${currentRoute[0]}/formation`}
    >
      Formations
    </SidebarItem>,
    <SidebarItem
      key="parcours"
      currentRoute={currentRoute}
      itemPath={"parcours"}
      icon={<Rocket className="w-4" />}
      linkTo={`/${currentRoute[0]}/parcours`}
    >
      Parcours
    </SidebarItem>,
    <SidebarItem
      key="module"
      currentRoute={currentRoute}
      itemPath={"module"}
      icon={<Component className="w-4" />}
      linkTo={`/${currentRoute[0]}/module`}
    >
      Modules
    </SidebarItem>,
    <SidebarItem
      key="course"
      currentRoute={currentRoute}
      itemPath={"course"}
      icon={<CourseIcon className="w-4" />}
      linkTo={`/${currentRoute[0]}/course`}
    >
      Cours
    </SidebarItem>,
    <SidebarItem
      key="lesson"
      currentRoute={currentRoute}
      itemPath={"lesson"}
      icon={<FileEdit className="w-4" />}
      linkTo={`/${currentRoute[0]}/lesson`}
    >
      Leçon
    </SidebarItem>,
    <SidebarItem
      key="user"
      currentRoute={currentRoute}
      itemPath={"user"}
      icon={<User className="w-4" />}
      linkTo={`/${currentRoute[0]}/user`}
    >
      Utilisateurs
    </SidebarItem>,
    <SidebarItem
      key="group"
      currentRoute={currentRoute}
      itemPath={"group"}
      icon={<GroupIcon className="w-4" />}
      linkTo={`/${currentRoute[0]}/group`}
    >
      Groupes
    </SidebarItem>,
    <SidebarItem
      key="role"
      currentRoute={currentRoute}
      itemPath={"roles"}
      icon={<Shield className="w-4" />}
      linkTo={`/${currentRoute[0]}/roles`}
    >
      Roles
    </SidebarItem>,
    <SidebarItem
      key="tag"
      currentRoute={currentRoute}
      itemPath={"tags"}
      icon={<Tag className="w-4" />}
      linkTo={`/${currentRoute[0]}/tags`}
    >
      Tags
    </SidebarItem>,
    <SidebarItem
      key="mediatheque"
      currentRoute={currentRoute}
      itemPath={"mediatheque"}
      icon={<Library className="w-4" />}
      linkTo={`/${currentRoute[0]}/mediatheque`}
    >
      Médiathèque
    </SidebarItem>,
    <SidebarItem
      key="resource"
      currentRoute={currentRoute}
      itemPath={"resources"}
      icon={<FileEdit className="w-4" />}
      linkTo={`/${currentRoute[0]}/resources`}
    >
      Ressources supplémentaires
    </SidebarItem>,
  ];

  return (
    <ul className={`flex flex-col px-2 gap-1`}>
      <SidebarItem
        itemPath={undefined}
        currentRoute={currentRoute}
        icon={<Home className="w-4" />}
        linkTo={`/${currentRoute[0]}`}
      >
        Accueil
      </SidebarItem>

      {sidebarItems}
    </ul>
  );
};

export default SidebarTopAdmin;
