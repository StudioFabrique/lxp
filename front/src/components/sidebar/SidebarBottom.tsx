import { CircleHelp, DoorOpen, LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import newLogo from "../../assets/andria-logo/logo-darkmode.svg";
import Questionnaire from "./Questionnaire";
import { AuthContext } from "../../store/AuthProvider";
import ProfilePopover from "../../features/profile/components/ProfilePopover";
import AiConsumptionPopover from "./AiConsumptionPopover";
import ThemeToggle from "../buttons/ThemeToggle";
import { emitOnboardingEvent } from "../../features/onboarding/onboarding-events";
import { useDemoMode } from "../../store/DemoContext";
import DemoExitConfirmation from "../../features/demo/components/DemoExitConfirmation";
import { clearDemoTour } from "../../features/demo/demo-tour-storage";
import { emitDemoTourEvent } from "../../features/demo/demo-tour-events";
import TutorialChoiceModal from "../../features/demo/components/TutorialChoiceModal";
import { useOnboarding } from "../../features/onboarding/OnboardingContext";
import {
  sidebarControlClassName,
  sidebarListClassName,
} from "./sidebar-styles";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarBottom = ({ interfaceType }: SharedSideBarProps) => {
  const { logout } = useContext(AuthContext);
  const { canStart: canStartOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const { demoMode, demoUrl, exitUrl, aiDisabled } = useDemoMode();
  const [isExitOpen, setIsExitOpen] = useState(false);
  const [isChoiceOpen, setIsChoiceOpen] = useState(false);

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
    <ul className={sidebarListClassName}>
      {/* Avatar */}
      <li className="flex w-full justify-center 2xl:block">
        <ProfilePopover interfaceType={interfaceType} />
      </li>

      {interfaceType === "admin" && !aiDisabled && (
        <li className="flex w-full justify-center 2xl:block">
          <AiConsumptionPopover />
        </li>
      )}

      {/* Bouton + modal questionnaire */}
      {!demoMode && interfaceType === "student" && <Questionnaire />}

      {(demoMode || canStartOnboarding) && (
        <li className="flex w-full justify-center 2xl:block">
          <button
            type="button"
            className={`${sidebarControlClassName} max-2xl:tooltip max-2xl:tooltip-right`}
            onClick={handleClickTutorial}
            data-tip="Relancer le tutoriel"
            aria-label="Relancer le tutoriel"
          >
            <CircleHelp className="size-4 shrink-0" />
            <span className="2xl:block hidden">Tutoriel guidé</span>
          </button>
        </li>
      )}

      {/* Sortie : quitter la démonstration remplace la déconnexion, le visiteur
          n'ayant pas de compte auquel revenir. */}
      {demoMode ? (
        <li className="flex w-full justify-center 2xl:block">
          <button
            type="button"
            className={`${sidebarControlClassName} max-2xl:tooltip max-2xl:tooltip-right`}
            data-tip="Quitter la démonstration"
            data-demo-tour="demo-exit"
            onClick={() => setIsExitOpen(true)}
            aria-label="Quitter la démonstration"
          >
            <DoorOpen className="size-4 shrink-0" />
            <span className="2xl:block hidden">Sortir de la démo</span>
          </button>
        </li>
      ) : (
        <li className="flex w-full justify-center 2xl:block">
          <button
            type="button"
            className={`${sidebarControlClassName} max-2xl:tooltip max-2xl:tooltip-right`}
            data-tip="Déconnexion"
            onClick={handleClickLogout}
            aria-label="Déconnexion"
          >
            <LogOutIcon className="size-4 shrink-0" />
            <span className="2xl:block hidden">Déconnexion</span>
          </button>
        </li>
      )}

      <li className="flex w-full flex-col-reverse items-center justify-between gap-1 2xl:flex-row">
        {/* Logo */}
        <div className="flex size-8 items-center justify-center 2xl:w-16">
          <img
            className="w-full object-contain"
            src={newLogo}
            alt="logo ANDRIA en blanc et bleu"
          />
        </div>
        <div
          className="tooltip tooltip-right 2xl:tooltip-top"
          data-tip="Mode clair / Mode sombre"
        >
          <ThemeToggle className="size-8 shrink-0 cursor-pointer rounded-lg p-0 transition-colors hover:bg-(--sidebar-hover)" />
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
