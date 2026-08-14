import { useContext } from "react";
import { X } from "lucide-react";
import { Joyride } from "react-joyride";

import SidebarRouteIcon from "../../components/headers/SidebarRouteIcon";
import { AuthContext } from "../../store/AuthProvider";
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

  if (layout === "admin") {
    return (
      <>
        <section
          className="relative flex flex-col w-full rounded-lg border border-base-300 bg-base-200 p-6 pr-12 shadow-sm"
          aria-labelledby="onboarding-welcome-title"
        >
          {closeButton}

          <div className="flex items-center gap-3">
            <SidebarRouteIcon />
            <h2
              id="onboarding-welcome-title"
              className="mb-2 flex items-center gap-1.5 text-3xl font-extrabold text-primary"
            >
              <span className="capitalize">
                {user?.firstname} {user?.lastname},
              </span>
              <span>{" Bienvenue sur la plateforme ANDRIA !"}</span>
            </h2>
          </div>
          <p className="max-w-3xl text-base-content opacity-80">
            Découvrez les outils essentiels pour administrer la plateforme et
            créer vos premiers contenus.
          </p>
          <button
            type="button"
            className="btn btn-primary self-end mt-4"
            onClick={() => void start()}
            disabled={isSaving}
            data-onboarding="welcome-start"
          >
            {isSaving && (
              <span className="loading loading-spinner loading-sm" />
            )}
            Regarder le tutoriel
          </button>
        </section>
        {welcomeTour}
      </>
    );
  }

  return (
    <>
      <section
        className="relative flex w-full select-none items-center justify-between rounded-lg bg-secondary/20 px-4 py-4 pr-10"
        aria-labelledby="onboarding-welcome-title"
      >
        {closeButton}

        <div className="flex min-w-0 items-center gap-3">
          <SidebarRouteIcon />
          <div className="min-w-0">
            <h2
              id="onboarding-welcome-title"
              className="mb-2 flex items-center gap-1.5 text-3xl font-extrabold text-primary"
            >
              <span>Bienvenue</span>
              <span className="capitalize">
                {user?.firstname} {user?.lastname}
              </span>
              <span> sur la plateforme ANDRIA !</span>
            </h2>
            <p className="text-xs text-base-content">
              Découvrez votre espace d’apprentissage et les outils qui vous
              accompagneront dans votre parcours.
            </p>
          </div>
        </div>

        <div className="ml-4 mr-3 flex shrink-0 items-center justify-end">
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
        </div>
      </section>
      {welcomeTour}
    </>
  );
};

export default OnboardingWelcome;
