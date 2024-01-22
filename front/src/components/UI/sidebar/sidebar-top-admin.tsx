import Parcours from "./sidebar-parts/parcours";
/* import Calendar from "./sidebar-parts/calendar";
import Library from "./sidebar-parts/library";
import Forum from "./sidebar-parts/forum"; */
import Home from "./sidebar-parts/home";
import Course from "./sidebar-parts/course";
import User from "./sidebar-parts/user";
import Group from "./sidebar-parts/group";

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopAdmin = ({ currentRoute }: SharedSideBarProps) => (
  <ul className="flex flex-col gap-y-6">
    <Home currentRoute={currentRoute} />
    <Parcours currentRoute={currentRoute} />
    <Course currentRoute={currentRoute} />
    <User currentRoute={currentRoute} />
    <Group currentRoute={currentRoute} />
    {/* <Calendar interfaceType={interfaceType} />
    <Library interfaceType={interfaceType} />
    <Forum interfaceType={interfaceType} /> */}
  </ul>
);

export default SidebarTopAdmin;
