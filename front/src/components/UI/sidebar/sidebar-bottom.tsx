import { LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "../mode-toggle";
import { useContext } from "react";
import { Context } from "../../../store/context.store";
import imageProfileReplacement from "../../../config/image-profile-replacement";

type SharedSideBarProps = {
  interfaceType: string;
  onLogout: () => void;
};

const SidebarBottom = ({ interfaceType, onLogout }: SharedSideBarProps) => {
  const { user } = useContext(Context);

  return (
    <ul className="flex flex-col gap-4 items-center">
      <li className="left-[14px]">
        <Link
          to={`/${interfaceType}/profil`}
          className="text-white p-0 rounded-lg h-[35px] w-[35px] tooltip tooltip-right"
          data-tip={`${user?.firstname && user?.firstname.charAt(0).toUpperCase() + user?.firstname.slice(1)}
            ${user?.lastname && user?.lastname.charAt(0).toUpperCase() + user?.lastname.slice(1)}`}
        >
          <img
            className="h-full w-full rounded-lg object-cover"
            src={`data:image/jpeg;base64,${
              user?.avatar ?? imageProfileReplacement
            }`}
            alt="User Avatar"
          />
        </Link>
      </li>
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
    </ul>
  );
};

export default SidebarBottom;
