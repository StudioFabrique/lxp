import { LogOutIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModeToggle from "../mode-toggle";
import { useContext } from "react";
import imageProfileReplacement from "../../../config/image-profile-replacement";
import { Context } from "../../../store/context.store";
import Questionnaire from "./questionnaire";
import yannickYannick from "./yannick-glitch.mp4";
import newLogo from "../../../assets/images/new-logo.svg";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarBottom = ({ interfaceType }: SharedSideBarProps) => {
  const { pathname } = useLocation();
  const isStudent = pathname.split("/")[1] === "student";

  const { user, logout } = useContext(Context);
  const navigate = useNavigate();

  const handleClickLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <ul className="flex flex-col gap-4 items-center">
      <li>
        <Link
          to={`/${interfaceType}/profil`}
          className="text-white rounded-lg h-[35px] w-[35px] tooltip tooltip-right group"
          data-tip={`${
            user?.firstname &&
            user?.firstname.charAt(0).toUpperCase() + user?.firstname.slice(1)
          }
            ${
              user?.lastname &&
              user?.lastname.charAt(0).toUpperCase() + user?.lastname.slice(1)
            }`}
        >
          {isStudent ? (
            <>
              <video
                src={yannickYannick}
                loop
                onMouseOver={(e) => {
                  e.currentTarget.play();
                }}
                className="h-full w-full rounded-lg object-cover absolute invisible group-hover:visible"
              />
              <img
                className="h-full w-full rounded-lg object-cover visible group-hover:invisible"
                src={`data:image/jpeg;base64,${
                  user?.avatar ?? imageProfileReplacement
                }`}
                alt="User Avatar"
              />
            </>
          ) : (
            <img
              className="h-full w-full rounded-lg object-cover"
              src={`data:image/jpeg;base64,${
                user?.avatar ?? imageProfileReplacement
              }`}
              alt="User Avatar"
            />
          )}
        </Link>
      </li>
      <li
        className="tooltip tooltip-right"
        data-tip="Questionnaire Bêta-Testeurs"
      >
        <Questionnaire />
      </li>

      <li className="tooltip tooltip-right" data-tip="Mode Clair / Mode Sombre">
        <ModeToggle />
      </li>

      <li>
        <div
          className="tooltip tooltip-right w-6 h-6 cursor-pointer"
          data-tip="Déconnexion"
          onClick={handleClickLogout}
        >
          <LogOutIcon />
        </div>
      </li>
      <li className="mb-2">
        <img
          className="w-full object-contain rounded-lg"
          src={newLogo}
          alt="logo de l'application"
        />
      </li>
    </ul>
  );
};

export default SidebarBottom;
