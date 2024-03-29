import { Link, useLocation } from "react-router-dom";

import ModeToggle from "../../mode-toggle";
import HomeIcon from "../../svg/home-icon";
import LogoutIcon from "../../svg/logout-icon";
import { LucideUserCircle } from "lucide-react";

interface SharedSideBarProps {
  interfaceType: string;
  onLogout: () => void;
}

const SharedSideBar = (props: SharedSideBarProps) => {
  const { pathname } = useLocation();
  const interfaceType = pathname.split("/")[1];

  return (
    <ul className="text-primary flex flex-col gap-y-4">
      <li className="tooltip tooltip-right" data-tip="Mode Clair / Mode Sombre">
        <ModeToggle />
      </li>
      <li>
        <Link to={`/${interfaceType}`}>
          <div className="tooltip tooltip-right w-6 h-6" data-tip="Accueil LXP">
            <HomeIcon />
          </div>
        </Link>
      </li>
      <li>
        <Link to={`/${interfaceType}/profil`}>
          <div className="tooltip tooltip-right w-6 h-6" data-tip="Profil">
            <LucideUserCircle />
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
