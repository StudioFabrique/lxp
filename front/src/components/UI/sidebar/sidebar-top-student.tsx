import Parcours from "./sidebar-parts/parcours";
import Home from "./sidebar-parts/home";
import Calendar from "./sidebar-parts/calendar";
import Library from "./sidebar-parts/library";
import Forum from "./sidebar-parts/forum";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarTopStudent = ({ interfaceType }: SharedSideBarProps) => (
  <ul className="flex flex-col gap-y-6">
    <Home interfaceType={interfaceType} />
    <Parcours interfaceType={interfaceType} />
    <Calendar interfaceType={interfaceType} />
    <Library interfaceType={interfaceType} />
    <Forum interfaceType={interfaceType} />
  </ul>
);

export default SidebarTopStudent;
