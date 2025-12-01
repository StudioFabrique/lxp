import { LogOutIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ModeToggle from "../mode-toggle";
import { useContext } from "react";
import { Context } from "../../../store/context.store";
import Questionnaire from "./questionnaire";
import newLogo from "../../../assets/images/new-logo-2.svg";
import { AvatarSmall } from "../avatar/avatar.component";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarBottom = ({ interfaceType }: SharedSideBarProps) => {
  const { user, logout } = useContext(Context);
  const navigate = useNavigate();

  const handleClickLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  console.log({ user });

  return (
    <ul className="flex flex-col gap-1 pl-2">
      <li>
        <Link
          to={`/${interfaceType}/profil`}
          className="flex gap-2 items-center text-white capitalize p-1 px-2 rounded-lg hover:bg-primary/50 text-sm"
          data-tip={`${
            user?.firstname &&
            user?.firstname.charAt(0).toUpperCase() + user?.firstname.slice(1)
          }
            ${
              user?.lastname &&
              user?.lastname.charAt(0).toUpperCase() + user?.lastname.slice(1)
            }`}
        >
          {user && (
            <AvatarSmall
              user={{
                ...user,
                avatar:
                  user?.avatar && `data:image/jpeg;base64,${user?.avatar}`,
              }}
              noImgClassName="text-xs flex justify-center items-center p-3 w-5 h-5 rounded-full bg-accent text-base-200"
              imgClassName="w-4 h-4 rounded-full object-cover"
            />
          )}
          {`${user?.firstname} ${user?.lastname}`}
        </Link>
      </li>

      <Questionnaire />

      <li
        className="cursor-pointer text-sm flex gap-2 p-1 px-2 rounded-lg hover:bg-primary/50"
        data-tip="Déconnexion"
        onClick={handleClickLogout}
      >
        <LogOutIcon className="w-4" />
        Déconnexion
      </li>

      <li className="my-2 flex items-center justify-between px-2">
        <img
          className="w-14 object-contain"
          src={newLogo}
          alt="logo ANDRIA en blanc et bleu"
        />
        <div
          className="tooltip tooltip-top"
          data-tip="Mode Clair / Mode Sombre"
        >
          <ModeToggle />
        </div>
      </li>
    </ul>
  );
};

export default SidebarBottom;
