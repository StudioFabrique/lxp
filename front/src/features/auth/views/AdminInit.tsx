import { useNavigate, useSearchParams } from "react-router";
import Welcome from "../components/Welcome";
import TokenForm from "../components/TokenForm";
import AdminSignInForm from "../components/AdminSignInForm";
import useAdminInit, { InitStep } from "../hooks/useAdminInit";
import { useContext, useState, type ReactNode } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";
import AndriaLogoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";
import { ThemeContext } from "../../../store/ThemeProvider";
import {
  clearPendingRootActivation,
  getPendingRootActivationEmail,
} from "../pending-root-activation";

const AdminInit = () => {
  const { initStep, token, onNextStep, onTokenValidated, restart } =
    useAdminInit();
  const { theme } = useContext(ThemeContext);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pendingActivationEmail, setPendingActivationEmail] = useState(
    getPendingRootActivationEmail,
  );
  const invitedToken = searchParams.get("token")?.trim() ?? "";
  const invitedEmail = searchParams.get("email")?.trim() ?? "";

  const restartCreation = () => {
    clearPendingRootActivation();
    setPendingActivationEmail("");
    restart();
  };

  const renderSetupPanel = (content: ReactNode, step: 1 | 2) => (
    <OnboardingProgressPanel
      contentKey={String(step)}
      currentStep={step}
      stepCount={2}
      animateProgressOnMount={step === 1}
      progressLabel="Progression de la configuration"
      className="min-h-[600px] flex-none lg:min-h-0 lg:flex-1"
      contentClassName="flex flex-col"
    >
      {content}
    </OnboardingProgressPanel>
  );

  let content: ReactNode;
  let panelStep: 1 | 2 = 1;
  if (pendingActivationEmail) {
    panelStep = 2;
    content = (
      <AdminSignInForm
        token=""
        initialActivationEmail={pendingActivationEmail}
        onSuccess={() => navigate("/")}
        onRestart={restartCreation}
      />
    );
  } else if (invitedToken && invitedEmail) {
    panelStep = 2;
    content = (
      <AdminSignInForm
        token={invitedToken}
        email={invitedEmail}
        onSuccess={() => navigate("/")}
        onRestart={() => {
          clearPendingRootActivation();
          navigate("/init", { replace: true });
        }}
      />
    );
  } else {
    switch (initStep) {
      case InitStep.Welcome:
        content = <Welcome onNext={onNextStep} />;
        break;
      case InitStep.TokenForm:
        content = <TokenForm onNext={onTokenValidated} />;
        break;
      case InitStep.SignInForm:
        panelStep = 2;
        content = (
          <AdminSignInForm
            token={token!}
            onSuccess={() => navigate("/")}
            onRestart={restartCreation}
          />
        );
    }
  }

  const isWelcome =
    !pendingActivationEmail &&
    !(invitedToken && invitedEmail) &&
    initStep === InitStep.Welcome;

  return (
    <LayoutGroup>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <motion.div
          layout
          transition={{
            duration: reduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={
            isWelcome
              ? "mb-12 mt-[clamp(5rem,15vh,10rem)] flex flex-col items-center gap-2 text-center"
              : "mb-10 mt-8 flex flex-col items-center gap-2 text-center"
          }
        >
          <img
            className="h-auto w-56"
            src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
            alt="logo ANDRIA"
          />
          <span className="mt-2 max-w-xs text-xs font-semibold text-base-content">
            Apprentissage Numérique & Développement Renforcé par Intelligence
            Artificielle
          </span>
        </motion.div>
        {isWelcome ? (
          content
        ) : (
          <motion.div
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.45,
              delay: reduceMotion ? 0 : 0.15,
            }}
          >
            {renderSetupPanel(content, panelStep)}
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
};

export default AdminInit;
