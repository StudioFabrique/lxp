import { useContext, useState, type PropsWithChildren } from "react";
import { useLocation } from "react-router";
import toast from "react-hot-toast";

import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";
import {
  IntroPresentationContext,
  type SidebarExit,
  type SidebarPhase,
} from "./IntroPresentationContext";
import {
  isIntroStillPending,
  shouldAutoOpenIntro,
} from "./intro-presentation-status";

type Props = {
  /** Faux tant que le compte n'est pas prêt, par exemple pendant le questionnaire apprenant. */
  isEligible?: boolean;
};

/**
 * Décide quand la présentation s'ouvre (sur le dashboard après l'onboarding, ou
 * à la demande depuis la barre latérale) ; `IntroPresentationGate` l'affiche.
 *
 * Le choix (ignorée ou terminée) est enregistré sur le compte et la fenêtre ne
 * se ferme qu'après confirmation du serveur. Une présentation rouverte après
 * coup ne modifie rien. Une fois le choix enregistré, la découverte du rôle
 * (détection puis espace correspondant) suit. En démonstration le compte est
 * partagé : elle ne s'ouvre jamais seule et rien n'est enregistré.
 */
export const IntroPresentationProvider = ({
  isEligible = true,
  children,
}: PropsWithChildren<Props>) => {
  const { user, updateOnboarding } = useContext(AuthContext);
  const { demoMode } = useDemoMode();
  const { pathname } = useLocation();
  const [isReopened, setIsReopened] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRoleRevealOpen, setIsRoleRevealOpen] = useState(false);
  const [isChatbotHidden, setChatbotHidden] = useState(false);
  const [sidebarExit, setSidebarExit] = useState<SidebarExit>("none");

  // Sans état enregistré, l'ancien compte est traité comme jamais présenté.
  const status = user?.onboarding?.status ?? "pending";
  const isOpen =
    Boolean(user) &&
    (isReopened ||
      shouldAutoOpenIntro({ status, pathname, isEligible, demoMode }));

  // La barre latérale se réduit pendant la première exploration, jusqu'à sa sortie ;
  // une présentation rejouée après coup la laisse normale.
  const isFirstRun = isOpen && isIntroStillPending(status);
  const sidebarPhase: SidebarPhase =
    isFirstRun || isRoleRevealOpen
      ? sidebarExit === "none"
        ? "skeleton"
        : sidebarExit
      : "normal";

  const close = async (choice: "skipped" | "completed") => {
    if (isSaving) return;
    if (demoMode || !isIntroStillPending(status)) {
      setIsReopened(false);
      return;
    }

    setIsSaving(true);
    // Armé avant l'écriture : la découverte du rôle prend le relais sans à-coup dès que le
    // serveur confirme. Seul le premier passage enregistré en bénéficie.
    setIsRoleRevealOpen(true);
    try {
      await updateOnboarding(choice);
      setIsReopened(false);
    } catch {
      setIsRoleRevealOpen(false);
      toast.error("Impossible d'enregistrer votre choix. Réessayez.");
    } finally {
      setIsSaving(false);
    }
  };

  const value = {
    isOpen,
    isSaving,
    isRoleRevealOpen,
    sidebarPhase,
    setSidebarExit,
    // Pendant la découverte du rôle, la séquence joue son propre chatbot.
    isChatbotHidden: isRoleRevealOpen || (isOpen && isChatbotHidden),
    setChatbotHidden,
    open: () => setIsReopened(true),
    skip: () => void close("skipped"),
    complete: () => void close("completed"),
    closeRoleReveal: () => {
      setIsRoleRevealOpen(false);
      setSidebarExit("none");
    },
  };

  return (
    <IntroPresentationContext value={value}>
      {children}
    </IntroPresentationContext>
  );
};
