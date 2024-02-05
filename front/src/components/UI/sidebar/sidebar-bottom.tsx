import { LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "../mode-toggle";
import { useContext } from "react";
import { Context } from "../../../store/context.store";

type SharedSideBarProps = {
  interfaceType: string;
  onLogout: () => void;
};

const SidebarBottom = ({ interfaceType, onLogout }: SharedSideBarProps) => {
  const { user } = useContext(Context);

  return (
    <ul className="flex flex-col gap-y-4">
      <li
        className="tooltip tooltip-right mb-1"
        data-tip="Mode Clair / Mode Sombre"
      >
        <ModeToggle />
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

      <li className="w-5 h-10" />

      <li className="absolute bottom-4 left-[12px]">
        <Link
          to={`/${interfaceType}/profil`}
          className="tooltip tooltip-right text-white rounded-lg"
          data-tip="Profil"
        >
          <img
            className="w-[40px] rounded-lg object-cover"
            src={`data:image/jpeg;base64,${user?.avatar}`}
            alt="User Avatar"
          />
        </Link>
      </li>
    </ul>
  );
};

export default SidebarBottom;
