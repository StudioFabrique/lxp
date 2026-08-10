import { CircleHelp, LogOutIcon, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import newLogo from "../../assets/andria-logo/logo-darkmode.svg";
import Questionnaire from "./Questionnaire";
import { AuthContext } from "../../store/AuthProvider";
import { AvatarSmall } from "../avatar/AvatarSmall";
import ThemeToggle from "../buttons/ThemeToggle";
import { emitOnboardingEvent } from "../../features/onboarding/onboarding-events";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarBottom = ({ interfaceType }: SharedSideBarProps) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fullName = user
    ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
    : "";

  const handleClickLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <ul className="flex flex-col gap-1 px-2 select-none">
      {/* Avatar */}
      <li className="w-full">
        <Link
          to={`/${interfaceType}/profil`}
          className="flex w-full gap-2 items-center text-white capitalize p-1 px-2 rounded-lg hover:bg-primary/50 text-sm"
          data-tip={fullName}
        >
          {user && (
            <AvatarSmall
              user={user}
              noImgClassName="text-xs flex justify-center items-center p-3 w-5 h-5 rounded-full bg-accent text-secondary-content"
              imgClassName="w-4 h-4 rounded-full object-cover"
            />
          )}
          <span className="xl:block hidden">{fullName}</span>
        </Link>
      </li>

      {interfaceType === "admin" && (
        <li
          className="flex w-full cursor-pointer gap-2 rounded-lg p-1 px-2 text-sm hover:bg-primary/50"
          data-tip="Déconnexion"
        >
          <Link
            to="/admin/dashboard-ia"
            className="flex w-full gap-x-2 items-center"
          >
            <Sparkles className="w-4 h-4" />
            <h2 className="xl:block hidden">Consommation IA</h2>
          </Link>
        </li>
      )}

      {/* Bouton + modal questionnaire */}
      <Questionnaire />

      <li className="w-full">
        <button
          type="button"
          className="flex w-full gap-2 items-center p-1 px-2 rounded-lg hover:bg-primary/50 text-sm"
          onClick={() => emitOnboardingEvent({ type: "restart" })}
          data-tip="Relancer le tutoriel"
        >
          <CircleHelp className="w-4" />
          <span className="xl:block hidden">Tutoriel</span>
        </button>
      </li>

      {/* Bouton Deconnection */}
      <li
        className="flex w-full cursor-pointer gap-2 rounded-lg p-1 px-2 text-sm hover:bg-primary/50"
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
