import { useContext, useEffect, useState, type PropsWithChildren } from "react";
import { useLocation } from "react-router";
import toast from "react-hot-toast";

import { useIsMobile } from "../../hooks/useMediaQuery";
import { AuthContext } from "../../store/AuthProvider";
import { useDemoMode } from "../../store/DemoContext";
import {
  IntroPresentationContext,
  type SidebarPhase,
} from "./IntroPresentationContext";
import { setIntroFirstRunHint } from "./intro-first-run-hint";
import {
  isDashboardLanding,
  isIntroStillPending,
  shouldAutoOpenIntro,
} from "./intro-presentation-status";

/** Durée pendant laquelle l'interface qui remplace la séquence est considérée comme en cours d'apparition. */
const HANDOFF_MS = 1500;

type Props = {
  /** Faux tant que le compte n'est pas prêt, par exemple pendant le questionnaire apprenant. */
  isEligible?: boolean;
  /**
   * Vrai tant que l'éligibilité se charge : la barre réduite s'affiche déjà, pour
   * qu'on ne voie pas la barre complète clignoter avant l'ouverture.
   */
  isEligibilityPending?: boolean;
};

/**
 * Décide quand la séquence s'ouvre (sur le dashboard après l'onboarding, ou
 * à la demande depuis la barre latérale) ; `IntroPresentationGate` l'affiche.
 *
 * La première fois, la découverte du rôle (détection puis espace correspondant)
 * vient en premier, puis la présentation de la méthodologie. Le choix (ignorée ou
 * terminée) est enregistré sur le compte à la fin de la présentation et la fenêtre
 * ne se ferme qu'après confirmation du serveur. Une présentation rouverte après
 * coup ne modifie rien et ne rejoue pas la découverte du rôle. En démonstration
 * le compte est partagé : rien ne s'ouvre seul et rien n'est enregistré.
 */
export const IntroPresentationProvider = ({
  isEligible = true,
  isEligibilityPending = false,
  children,
}: PropsWithChildren<Props>) => {
  const { user, updateOnboarding } = useContext(AuthContext);
  const { demoMode } = useDemoMode();
  const { pathname } = useLocation();
  // Page où la présentation a été rouverte : naviguer ailleurs la ferme.
  const [reopenedAt, setReopenedAt] = useState<string | null>(null);
  const isReopened = reopenedAt === pathname;
  useEffect(() => {
    if (reopenedAt !== null && reopenedAt !== pathname) setReopenedAt(null);
  }, [reopenedAt, pathname]);
  const [isSaving, setIsSaving] = useState(false);
  // Vrai une fois la découverte du rôle terminée : la présentation prend alors le relais.
  const [isRoleRevealDone, setIsRoleRevealDone] = useState(false);
  const isMobile = useIsMobile();
  const [isChatbotHidden, setChatbotHidden] = useState(false);
  // Le temps que l'interface réelle remplace la séquence : l’assistant virtuel est déjà en place, sans entrée animée.
  const [hasJustRevealed, setHasJustRevealed] = useState(false);
  useEffect(() => {
    if (!hasJustRevealed) return;
    const timer = setTimeout(() => setHasJustRevealed(false), HANDOFF_MS);
    return () => clearTimeout(timer);
  }, [hasJustRevealed]);

  // Sans état enregistré, l'ancien compte est traité comme jamais présenté.
  const status = user?.onboarding?.status ?? "pending";
  const isAutoOpen =
    Boolean(user) &&
    shouldAutoOpenIntro({ status, pathname, isEligible, demoMode });
  // Première exploration : la découverte du rôle précède la présentation.
  const isRoleRevealOpen = isAutoOpen && !isReopened && !isRoleRevealDone;
  const isOpen = Boolean(user) && !isRoleRevealOpen && (isReopened || isAutoOpen);

  // La barre latérale se réduit pendant la première exploration, jusqu'à sa sortie ;
  // une présentation rejouée après coup la laisse normale.
  const isFirstRun = isOpen && isIntroStillPending(status);
  // Avant l'ouverture : éligibilité en cours de lecture, ou redirection vers le dashboard
  // en cours (juste après la connexion). La barre complète ne doit pas clignoter.
  const isOpeningSoon =
    !isOpen &&
    Boolean(user) &&
    !demoMode &&
    isIntroStillPending(status) &&
    (isEligible || isEligibilityPending) &&
    (isEligibilityPending
      ? shouldAutoOpenIntro({ status, pathname, isEligible: true, demoMode })
      : isDashboardLanding(pathname));
  const isFirstRunPending =
    Boolean(user) && !demoMode && isIntroStillPending(status);
  useEffect(() => {
    if (user) setIntroFirstRunHint(isFirstRunPending);
  }, [user, isFirstRunPending]);
  // La démonstration partage son compte : sa barre reste complète. Sur bureau, la barre complète
  // reste aussi affichée pendant la présentation ; seule la barre réduite du mobile est conservée.
  // Pendant la découverte du rôle, elle est masquée.
  let sidebarPhase: SidebarPhase = "normal";
  if (!demoMode) {
    if (isRoleRevealOpen) sidebarPhase = "gone";
    else if (isMobile && (isFirstRun || isOpeningSoon)) sidebarPhase = "skeleton";
  }

  const close = async (choice: "skipped" | "completed") => {
    if (isSaving) return;
    if (demoMode || !isIntroStillPending(status)) {
      setReopenedAt(null);
      return;
    }

    setIsSaving(true);
    try {
      await updateOnboarding(choice);
      setReopenedAt(null);
      setHasJustRevealed(true);
    } catch {
      toast.error("Impossible d'enregistrer votre choix. Réessayez.");
    } finally {
      setIsSaving(false);
    }
  };

  const value = {
    isOpen,
    isSaving,
    isRoleRevealOpen,
    hasJustRevealed,
    sidebarPhase,
    // Pendant la découverte du rôle, la séquence joue son propre assistant virtuel.
    isChatbotHidden: isRoleRevealOpen || (isOpen && isChatbotHidden),
    setChatbotHidden,
    open: () => setReopenedAt(pathname),
    skip: () => void close("skipped"),
    complete: () => void close("completed"),
    closeRoleReveal: () => {
      setIsRoleRevealDone(true);
    },
  };

  return (
    <IntroPresentationContext value={value}>
      {children}
    </IntroPresentationContext>
  );
};
