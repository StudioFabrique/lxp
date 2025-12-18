import { Calendar, Home, Rocket, Toilet } from "lucide-react";
import SidebarItem from "./sidebar-parts/sidebar-item";

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopStudent = ({ currentRoute }: SharedSideBarProps) => {
  const sidebarItems = [
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
    <SidebarItem
      key="ressources-supp"
      currentRoute={currentRoute}
      itemPath={"ressources"}
      icon={<Toilet className="w-4" />}
      linkTo={`/${currentRoute[0]}/ressources`}
    >
      Ressources Supplémentaires
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

export default SidebarTopStudent;
