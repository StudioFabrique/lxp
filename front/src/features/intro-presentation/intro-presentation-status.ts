import type { OnboardingStatus } from "../../utils/interfaces/user";

type AutoOpenParams = {
  status: OnboardingStatus;
  pathname: string;
  /** Faux tant que le compte n'est pas prêt (ex. questionnaire apprenant en cours). */
  isEligible: boolean;
  demoMode: boolean;
};

/**
 * La présentation s'ouvre seule sur le dashboard, une fois l'onboarding du
 * compte terminé, tant que l'utilisateur ne l'a ni ignorée ni terminée.
 *
 * `in_progress` est l'ancien état du tutoriel Joyride : il n'existe plus, on le
 * traite comme une présentation encore jamais vue.
 */
export const shouldAutoOpenIntro = ({
  status,
  pathname,
  isEligible,
  demoMode,
}: AutoOpenParams): boolean =>
  isEligible &&
  !demoMode &&
  (status === "pending" || status === "in_progress") &&
  pathname.endsWith("/dashboard");

/** Seule une présentation encore à voir enregistre un choix sur le compte. */
export const isIntroStillPending = (status: OnboardingStatus): boolean =>
  status === "pending" || status === "in_progress";
