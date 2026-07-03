import { LogOutIcon, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import newLogo from "../../assets/andria-logo/logo-darkmode.svg";
import Questionnaire from "./Questionnaire";
import { AuthContext } from "../../store/AuthProvider";
import { AvatarSmall } from "../avatar/AvatarSmall";
import ThemeToggle from "../buttons/ThemeToggle";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarBottom = ({ interfaceType }: SharedSideBarProps) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClickLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <ul className="flex flex-col gap-1 xl:pl-2 items-center xl:items-start select-none">
      {/* Avatar */}
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
              noImgClassName="text-xs flex justify-center items-center p-3 w-5 h-5 rounded-full bg-accent text-secondary-content"
              imgClassName="w-4 h-4 rounded-full object-cover"
            />
          )}
          <span className="xl:block hidden">{`${user?.firstname} ${user?.lastname}`}</span>
        </Link>
      </li>

      {interfaceType === "admin" && (
        <li
          className="cursor-pointer text-sm flex gap-2 p-2 rounded-lg hover:bg-primary/50"
          data-tip="Déconnexion"
        >
          <Link
            to="/admin/dashboard-ia"
            className="flex gap-x-2 items-center tooltip tooltip-right"
            data-tip="Dashboard IA"
          >
            <Sparkles className="w-4 h-4" />
            <h2 className="xl:block hidden">Consommation IA</h2>
          </Link>
        </li>
      )}

      {/* Bouton + modal questionnaire */}
      <Questionnaire />

      {/* Bouton Deconnection */}
      <li
        className="cursor-pointer text-sm flex gap-2 p-1 px-2 rounded-lg hover:bg-primary/50"
        data-tip="Déconnexion"
        onClick={handleClickLogout}
      >
        <LogOutIcon className="w-4" />
        <span className="xl:block hidden">Déconnexion</span>
      </li>

      <li className="my-2 gap-4 flex flex-col-reverse xl:flex-row items-center justify-between w-full xl:px-2">
        {/* Logo */}
        <img
          className="xl:w-16 w-10 object-contain"
          src={newLogo}
          alt="logo ANDRIA en blanc et bleu"
        />
        {/* Toggle clair/sombre */}
        <div
          className="tooltip xl:tooltip-top tooltip-right xl:w-5 w-4"
          data-tip="Mode Clair / Mode Sombre"
        >
          <ThemeToggle />
        </div>
      </li>
    </ul>
  );
};

export default SidebarBottom;
