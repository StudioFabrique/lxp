import { Calendar, Home, Rocket } from "lucide-react";
import SidebarItem from "./sidebar-parts/sidebar-item";

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopStudent = ({ currentRoute }: SharedSideBarProps) => {
  const sidebarItems = [
    <SidebarItem
      itemPath={undefined}
      currentRoute={currentRoute}
      icon={<Home className="w-4" />}
      linkTo={`/${currentRoute[0]}`}
      tooltipText="Accueil"
    >
      Accueil
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
      key="calendrier"
      currentRoute={currentRoute}
      itemPath={"calendrier"}
      icon={<Calendar className="w-4" />}
      linkTo={`/${currentRoute[0]}/calendrier`}
    >
      Calendrier
    </SidebarItem>,
  ];

  return <ul className={`flex flex-col px-2 gap-1`}>{sidebarItems}</ul>;
};

export default SidebarTopStudent;
