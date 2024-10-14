import Can from "../can/can.component";
import Course from "./sidebar-parts/course";
import Formation from "./sidebar-parts/formation";
import Group from "./sidebar-parts/group";
import Home from "./sidebar-parts/home";
import Lesson from "./sidebar-parts/lesson";
import Module from "./sidebar-parts/module";
import Parcours from "./sidebar-parts/parcours";
import Roles from "./sidebar-parts/roles";
import User from "./sidebar-parts/user";

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopAdmin = ({ currentRoute }: SharedSideBarProps) => (
  <ul className="flex flex-col gap-6 items-center">
    <Home currentRoute={currentRoute} />
    <Formation currentRoute={currentRoute} />
    <Parcours currentRoute={currentRoute} />
    <Module currentRoute={currentRoute} />
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
