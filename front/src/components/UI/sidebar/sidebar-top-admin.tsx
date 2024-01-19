import Parcours from "./sidebar-parts/parcours";
/* import Calendar from "./sidebar-parts/calendar";
import Library from "./sidebar-parts/library";
import Forum from "./sidebar-parts/forum"; */
import Home from "./sidebar-parts/home";
import Course from "./sidebar-parts/course";
import User from "./sidebar-parts/user";
import Group from "./sidebar-parts/group";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarTopAdmin = ({ interfaceType }: SharedSideBarProps) => (
  <ul className="flex flex-col gap-y-6">
    <Home interfaceType={interfaceType} />
    <Parcours interfaceType={interfaceType} />
    <Course interfaceType={interfaceType} />
    <User interfaceType={interfaceType} />
    <Group interfaceType={interfaceType} />
    {/* <Calendar interfaceType={interfaceType} />
    <Library interfaceType={interfaceType} />
    <Forum interfaceType={interfaceType} /> */}
  </ul>
);

export default SidebarTopAdmin;
