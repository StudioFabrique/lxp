import {
  CalendarIcon,
  HomeIcon,
  LibraryBigIcon,
  MessageCircleIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Parcours from "./sidebar-parts/parcours";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarTopStudent = ({ interfaceType }: SharedSideBarProps) => {
  return (
    <ul className="text-primary flex flex-col gap-y-4">
      <li>
        <Link to={`/${interfaceType}`}>
          <div className="tooltip tooltip-right w-6 h-6" data-tip="Accueil LXP">
            <HomeIcon />
          </div>
        </Link>
      </li>
      <Parcours interfaceType={interfaceType} />
      <li>
        <Link to={`/${interfaceType}/calendar`}>
          <div className="tooltip tooltip-right w-6 h-6" data-tip="Calendrier">
            <CalendarIcon />
          </div>
        </Link>
      </li>
      <li>
        <Link to={`/${interfaceType}/library`}>
          <div
            className="tooltip tooltip-right w-6 h-6"
            data-tip="Bibliothèque"
          >
            <LibraryBigIcon />
          </div>
        </Link>
      </li>
      <li>
        <Link to={`/${interfaceType}/forum`}>
          <div className="tooltip tooltip-right w-6 h-6" data-tip="Forum">
            <MessageCircleIcon />
          </div>
        </Link>
      </li>
    </ul>
  );
};

export default SidebarTopStudent;
