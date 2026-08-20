import { useContext } from "react";
import { X } from "lucide-react";
import { Joyride } from "react-joyride";

import Header from "../../components/headers/Header";
import { AuthContext } from "../../store/AuthProvider";
import { toUpperFirstLetter } from "../../utils/helpers/text-helpers";
import { useOnboarding } from "./OnboardingContext";
import OnboardingWelcomeTooltip from "./OnboardingWelcomeTooltip";
import { onboardingWelcomeTourSteps } from "./onboarding-welcome-tour-steps";

type Props = {
  layout: "admin" | "student";
};

const OnboardingWelcome = ({ layout }: Props) => {
  const { user } = useContext(AuthContext);
  const { isSaving, start, skip } = useOnboarding();

  const welcomeTour = (
    <Joyride
      run
      steps={onboardingWelcomeTourSteps}
      tooltipComponent={OnboardingWelcomeTooltip}
      scrollToFirstStep
      floatingOptions={{
        strategy: "fixed",
        shiftOptions: { mainAxis: true, crossAxis: true, padding: 16 },
        flipOptions: { padding: 16 },
      }}
      styles={{
        floater: {
          boxSizing: "border-box",
          maxWidth: "calc(100vw - 2rem)",
        },
      }}
      options={{
        buttons: ["close"],
        closeButtonAction: "skip",
        dismissKeyAction: "close",
        overlayClickAction: false,
        overlayColor: "rgba(2, 6, 23, 0.72)",
        primaryColor: "var(--color-primary)",
        backgroundColor: "var(--color-base-100)",
        textColor: "var(--color-base-content)",
        arrowColor: "var(--color-base-100)",
        showProgress: false,
        spotlightRadius: 10,
        targetWaitTimeout: 5_000,
        zIndex: 2100,
      }}
      locale={{ close: "Fermer cette aide" }}
    />
  );

  const closeButton = (
    <button
      type="button"
      className="btn btn-circle btn-ghost btn-xs tooltip tooltip-left absolute right-2 top-2 z-10 text-base-content/50 hover:text-base-content"
      onClick={() => void skip()}
      disabled={isSaving}
      data-tip="Passer le tutoriel"
      aria-label="Passer le tutoriel"
    >
      <X size={17} />
    </button>
  );

  const fullname = [
    toUpperFirstLetter(user?.firstname),
    toUpperFirstLetter(user?.lastname),
  ]
    .filter(Boolean)
    .join(" ");

  const title =
    layout === "admin"
      ? `${fullname}, Bienvenue sur la plateforme ANDRIA !`
      : `Bienvenue ${fullname} sur la plateforme ANDRIA !`;

  const description =
    layout === "admin"
      ? "Découvrez les outils essentiels pour administrer la plateforme et créer vos premiers contenus."
      : "Découvrez votre espace d’apprentissage et les outils qui vous accompagneront dans votre parcours.";

  return (
    <>
      <section aria-label="Message de bienvenue">
        <Header
          title={title}
          description={description}
          containerClassname="relative pr-12"
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void start()}
            disabled={isSaving}
            data-onboarding="welcome-start"
          >
            {isSaving && (
              <span className="loading loading-spinner loading-sm" />
            )}
            Regarder le tutoriel
          </button>
          {closeButton}
        </Header>
      </section>
      {welcomeTour}
    </>
  );
};

export default OnboardingWelcome;
