import { LogOutIcon, LucideUserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "../mode-toggle";

type SharedSideBarProps = {
  interfaceType: string;
  onLogout: () => void;
};

const SidebarBottom = ({ interfaceType, onLogout }: SharedSideBarProps) => {
  return (
    <ul className="text-primary flex flex-col gap-y-4">
      <li
        className="tooltip tooltip-right mb-1"
        data-tip="Mode Clair / Mode Sombre"
      >
        <ModeToggle />
      </li>

      <li>
        <Link to={`/${interfaceType}/profil`}>
          <div className="tooltip tooltip-right w-6 h-6" data-tip="Accueil LXP">
            <LucideUserCircle />
          </div>
        </Link>
      </li>

      <li>
        <div
          className="tooltip tooltip-right w-6 h-6 cursor-pointer"
          data-tip="Déconnexion"
          onClick={() => onLogout()}
        >
          <LogOutIcon />
        </div>
      </li>
    </ul>
  );
};

export default SidebarBottom;
