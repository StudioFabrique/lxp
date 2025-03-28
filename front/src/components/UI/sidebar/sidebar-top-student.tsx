import Parcours from "./sidebar-parts/parcours";
import Home from "./sidebar-parts/home";
import Calendar from "./sidebar-parts/calendar";
import Tags from "./sidebar-parts/tags";

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopStudent = ({ currentRoute }: SharedSideBarProps) => (
  <ul className="flex flex-col gap-6 items-center">
    <Home currentRoute={currentRoute} />
    <Parcours currentRoute={currentRoute} />
    <Calendar currentRoute={currentRoute} />
    <Tags currentRoute={currentRoute} />
  </ul>
);

export default SidebarTopStudent;
