import { CircleHelp, DoorOpen, LogOutIcon, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import newLogo from "../../assets/andria-logo/logo-darkmode.svg";
import Questionnaire from "./Questionnaire";
import { AuthContext } from "../../store/AuthProvider";
import { AvatarSmall } from "../avatar/AvatarSmall";
import ThemeToggle from "../buttons/ThemeToggle";
import { emitOnboardingEvent } from "../../features/onboarding/onboarding-events";
import { useDemoMode } from "../../store/DemoContext";
import DemoExitConfirmation from "../../features/demo/components/DemoExitConfirmation";
import { clearDemoTour } from "../../features/demo/demo-tour-storage";
import { emitDemoTourEvent } from "../../features/demo/demo-tour-events";
import TutorialChoiceModal from "../../features/demo/components/TutorialChoiceModal";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarBottom = ({ interfaceType }: SharedSideBarProps) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { demoMode, demoUrl, exitUrl, aiDisabled } = useDemoMode();
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isChoiceOpen, setIsChoiceOpen] = useState(false);

  const fullName = user
    ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
    : "";

  const handleClickLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleExitDemo = async () => {
    clearDemoTour();
    await logout();
    // Changement d'origine : `navigate` ne suffit pas pour sortir du site.
    window.location.href = exitUrl || "/demo";
  };

  // Hors démonstration, proposer le choix n'a de sens que si une instance de
  // démonstration existe ; sinon on garde le comportement d'origine.
  const handleClickTutorial = () => {
    if (demoMode) return emitDemoTourEvent({ type: "restart" });
    if (demoUrl) return setIsChoiceOpen(true);
    emitOnboardingEvent({ type: "restart" });
  };

  return (
    <ul className="flex flex-col gap-1 px-2 select-none">
      {/* Avatar */}
      <li className="w-full">
        <Link
          to={`/${interfaceType}/profil`}
          className="flex w-full gap-2 items-center justify-center xl:justify-start xl:p-1 py-2 capitalize rounded-lg hover:bg-[var(--sidebar-hover)] text-sm transition-colors"
          data-tip={fullName}
        >
          {user && (
            <AvatarSmall
              user={user}
              noImgClassName="text-xs flex justify-center items-center p-3 w-5 h-5 rounded-full bg-accent text-accent-content"
              imgClassName="w-6 h-6 rounded-full object-cover"
            />
          )}
          <span className="xl:block hidden">{fullName}</span>
        </Link>
      </li>

      {interfaceType === "admin" && !aiDisabled && (
        <li
          className="flex w-full cursor-pointer gap-2 rounded-lg p-1 px-2 text-sm hover:bg-[var(--sidebar-hover)] transition-colors"
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
      {!demoMode && interfaceType === "student" && <Questionnaire />}

      <li className="w-full">
        <button
          type="button"
          className="flex w-full cursor-pointer gap-2 items-center p-1 px-2 rounded-lg hover:bg-[var(--sidebar-hover)] text-sm transition-colors"
          onClick={handleClickTutorial}
          data-tip="Relancer le tutoriel"
        >
          <CircleHelp className="w-4" />
          <span className="xl:block hidden">Tutoriel guidée</span>
        </button>
      </li>

      {/* Sortie : quitter la démonstration remplace la déconnexion, le visiteur
          n'ayant pas de compte auquel revenir. */}
      {demoMode ? (
        <li
          className="flex w-full cursor-pointer gap-2 rounded-lg p-1 px-2 text-sm hover:bg-[var(--sidebar-hover)] transition-colors"
          data-tip="Quitter la démonstration"
          data-demo-tour="demo-exit"
          onClick={() => setIsExitOpen(true)}
        >
          <DoorOpen className="w-4" />
          <span className="xl:block hidden">Sortir de la démo</span>
        </li>
      ) : (
        <li
          className="flex w-full cursor-pointer gap-2 rounded-lg p-1 px-2 text-sm hover:bg-[var(--sidebar-hover)] transition-colors"
          data-tip="Déconnexion"
          onClick={handleClickLogout}
        >
          <LogOutIcon className="w-4" />
          <span className="xl:block hidden">Déconnexion</span>
        </li>
      )}

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
      {isExitOpen && (
        <DemoExitConfirmation
          onCancel={() => setIsExitOpen(false)}
          onConfirm={() => void handleExitDemo()}
        />
      )}

      {isChoiceOpen && (
        <TutorialChoiceModal
          demoUrl={demoUrl}
          onClose={() => setIsChoiceOpen(false)}
          onStartTutorial={() => {
            setIsChoiceOpen(false);
            emitOnboardingEvent({ type: "restart" });
          }}
        />
      )}
    </ul>
  );
};

export default SidebarBottom;
