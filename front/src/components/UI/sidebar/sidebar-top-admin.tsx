import Parcours from "./sidebar-parts/parcours";
/* import Calendar from "./sidebar-parts/calendar";
import Library from "./sidebar-parts/library";
import Forum from "./sidebar-parts/forum"; */
import Home from "./sidebar-parts/home";
import Course from "./sidebar-parts/course";
import User from "./sidebar-parts/user";
import Group from "./sidebar-parts/group";
import Lesson from "./sidebar-parts/lesson";
import Formation from "./sidebar-parts/formation";
import Can from "../can/can.component";
import Roles from "./sidebar-parts/roles";

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopAdmin = ({ currentRoute }: SharedSideBarProps) => (
  <ul className="flex flex-col gap-y-6">
    <Home currentRoute={currentRoute} />
    <Formation currentRoute={currentRoute} />
    <Parcours currentRoute={currentRoute} />
    <Course currentRoute={currentRoute} />
    <Lesson currentRoute={currentRoute} />
    <User currentRoute={currentRoute} />
    <Group currentRoute={currentRoute} />
    <Can action="write" object="role">
      <Roles currentRoute={currentRoute} />
    </Can>
    {/* <Calendar interfaceType={interfaceType} />
    <Library interfaceType={interfaceType} />
    <Forum interfaceType={interfaceType} /> */}
  </ul>
);

export default SidebarTopAdmin;
