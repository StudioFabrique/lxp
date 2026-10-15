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
import { useSidebarDisplay } from "./sidebar-display";

type SharedSideBarProps = {
  interfaceType: string;
};

const SidebarBottom = ({ interfaceType }: SharedSideBarProps) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { open: openIntroPresentation } = useIntroPresentation();
  const { demoMode, exitUrl, aiDisabled } = useDemoMode();
  const [isExitOpen, setIsExitOpen] = useState(false);
  const { expanded } = useSidebarDisplay();

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
        <li className={cn("block w-full", !expanded && "max-2xl:order-2")}>
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
        <li className={cn("block w-full", !expanded && "max-2xl:order-2")}>
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
      <li
        className={cn(
          // Tiroir mobile : le logo et le thème deviennent des cartes de la grille, à la suite de « Déconnexion ».
          "flex w-full items-center justify-between gap-1 group-data-[variant=drawer]/sidebar:contents",
          expanded
            ? "flex-row"
            : "flex-col-reverse max-2xl:contents 2xl:flex-row",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex size-8 items-center justify-center",
            expanded ? "w-16" : "max-2xl:order-3 max-2xl:self-center 2xl:w-16",
            // Tiroir mobile : le logo seul, sans carte autour, plus grand, sur deux colonnes à côté de « Déconnexion ».
            "group-data-[variant=drawer]/sidebar:col-span-2 group-data-[variant=drawer]/sidebar:size-auto group-data-[variant=drawer]/sidebar:w-full group-data-[variant=drawer]/sidebar:px-3 group-data-[variant=drawer]/sidebar:[&>svg]:max-w-36",
          )}
        >
          <SidebarLogo />
        </div>
        <div
          className={cn(
            "tooltip tooltip-right",
            expanded
              ? "tooltip-top"
              : "max-2xl:order-1 max-2xl:self-center 2xl:tooltip-top",
            // Tiroir mobile : une carte carrée dont le bouton occupe toute la surface, calée dans la dernière colonne (à droite).
            "group-data-[variant=drawer]/sidebar:col-end-[-1] group-data-[variant=drawer]/sidebar:flex group-data-[variant=drawer]/sidebar:aspect-square group-data-[variant=drawer]/sidebar:items-center group-data-[variant=drawer]/sidebar:justify-center group-data-[variant=drawer]/sidebar:rounded-xl group-data-[variant=drawer]/sidebar:border group-data-[variant=drawer]/sidebar:border-(--sidebar-border) group-data-[variant=drawer]/sidebar:[&>div]:size-full group-data-[variant=drawer]/sidebar:hover:bg-(--sidebar-hover)",
          )}
          data-tip="Mode clair / Mode sombre"
        >
          <ThemeToggle className="size-8 shrink-0 cursor-pointer rounded-lg p-0 transition-colors hover:bg-(--sidebar-hover) group-data-[variant=drawer]/sidebar:size-full" />
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
