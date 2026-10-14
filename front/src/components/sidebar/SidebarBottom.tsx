import { DoorOpen, LogOutIcon, Presentation } from "lucide-react";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import SidebarLogo from "./SidebarLogo";
import Questionnaire from "./Questionnaire";
import { AuthContext } from "../../store/AuthProvider";
import ProfilePopover from "../../features/profile/components/ProfilePopover";
import AiConsumptionPopover from "./AiConsumptionPopover";
import ThemeToggle from "../buttons/ThemeToggle";
import { useDemoMode } from "../../store/DemoContext";
import { useIntroPresentation } from "../../features/intro-presentation/useIntroPresentation";
import DemoExitConfirmation from "../../features/demo/components/DemoExitConfirmation";
import {
  sidebarControlClassName,
  sidebarLabelClassName,
  sidebarListClassName,
} from "./sidebar-styles";
import { cn } from "../../utils/cn";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarBottom = ({ interfaceType }: SharedSideBarProps) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { open: openIntroPresentation } = useIntroPresentation();
  const { demoMode, exitUrl, aiDisabled } = useDemoMode();
  const [isExitOpen, setIsExitOpen] = useState(false);

  const handleClickLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleExitDemo = async () => {
    await logout();
    // Changement d'origine : `navigate` ne suffit pas pour sortir du site.
    window.location.href = exitUrl || "/demo";
  };

  return (
    <ul className={sidebarListClassName}>
      {/* Avatar */}
      <li className="block w-full">
        <ProfilePopover interfaceType={interfaceType} />
      </li>

      {interfaceType === "admin" && !aiDisabled && (
        <li className="block w-full">
          <AiConsumptionPopover />
        </li>
      )}

      {/* Bouton + modal questionnaire */}
      {!demoMode && interfaceType === "student" && <Questionnaire />}

      <li className="block w-full">
        <button
          type="button"
          className={cn(sidebarControlClassName, "max-2xl:tooltip max-2xl:tooltip-right")}
          onClick={openIntroPresentation}
          data-tip="Revoir la présentation"
          aria-label="Revoir la présentation"
        >
          <Presentation className="size-4 shrink-0" />
          <span className={sidebarLabelClassName}>Revoir la présentation</span>
        </button>
      </li>

      {/* Sortie : quitter la démonstration remplace la déconnexion, le visiteur
          n'ayant pas de compte auquel revenir. */}
      {demoMode ? (
        <li className="block w-full max-2xl:order-2">
          <button
            type="button"
            className={cn(sidebarControlClassName, "max-2xl:tooltip max-2xl:tooltip-right")}
            data-tip="Quitter la démonstration"
            onClick={() => setIsExitOpen(true)}
            aria-label="Quitter la démonstration"
          >
            <DoorOpen className="size-4 shrink-0" />
            <span className={sidebarLabelClassName}>Sortir de la démo</span>
          </button>
        </li>
      ) : (
        <li className="block w-full max-2xl:order-2">
          <button
            type="button"
            className={cn(sidebarControlClassName, "max-2xl:tooltip max-2xl:tooltip-right")}
            data-tip="Déconnexion"
            onClick={handleClickLogout}
            aria-label="Déconnexion"
          >
            <LogOutIcon className="size-4 shrink-0" />
            <span className={sidebarLabelClassName}>Déconnexion</span>
          </button>
        </li>
      )}

      {/* En mode compact, la ligne se défait : thème, puis sortie, puis logo tout en bas. */}
      <li className="flex w-full flex-col-reverse items-center justify-between gap-1 max-2xl:contents 2xl:flex-row">
        {/* Logo */}
        <div className="flex size-8 items-center justify-center max-2xl:order-3 max-2xl:self-center 2xl:w-16">
          <SidebarLogo />
        </div>
        <div
          className="tooltip tooltip-right max-2xl:order-1 max-2xl:self-center 2xl:tooltip-top"
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
    </ul>
  );
};

export default SidebarBottom;
