import { Link } from "react-router-dom";

import ModeToggle from "../mode-toggle";
import HomeIcon from "../svg/home-icon";
import LogoutIcon from "../svg/logout-icon";

interface SharedSideBarProps {
  onLogout: () => void;
}

const SharedSideBar = (props: SharedSideBarProps) => {
  return (
    <ul className="text-primary flex flex-col gap-y-4">
      <li className="tooltip tooltip-right" data-tip="Mode Clair / Mode Sombre">
        <ModeToggle />
      </li>
      <li>
        <Link to="/">
          <div className="tooltip tooltip-right w-6 h-6" data-tip="Accueil LXP">
            <HomeIcon />
          </div>
        </Link>
      </li>
      <li>
        <div
          className="tooltip tooltip-right w-6 h-6 cursor-pointer"
          data-tip="Déconnexion"
          onClick={() => props.onLogout()}
        >
          <LogoutIcon />
        </div>
      </li>
    </ul>
  );
};

export default SharedSideBar;
