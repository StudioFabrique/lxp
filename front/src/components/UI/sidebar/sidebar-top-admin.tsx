import { MessageCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Parcours from "./sidebar-parts/parcours";
import Home from "./sidebar-parts/home";
import Calendar from "./sidebar-parts/calendar";
import Library from "./sidebar-parts/library";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarTopAdmin = ({ interfaceType }: SharedSideBarProps) => (
  <ul className="text-primary flex flex-col gap-y-4">
    <Home interfaceType={interfaceType} />
    <Parcours interfaceType={interfaceType} />
    <Calendar interfaceType={interfaceType} />
    <Library interfaceType={interfaceType} />
    <li>
      <Link to={`/${interfaceType}/forum`}>
        <div className="tooltip tooltip-right w-6 h-6" data-tip="Forum">
          <MessageCircleIcon />
        </div>
      </Link>
    </li>
  </ul>
);

export default SidebarTopAdmin;
