import { useNavigate, useSearchParams } from "react-router";
import Welcome from "../components/Welcome";
import TokenForm from "../components/TokenForm";
import AdminSignInForm from "../components/AdminSignInForm";
import useAdminInit, { InitStep } from "../hooks/useAdminInit";
import { useState, type ReactNode } from "react";
import OnboardingProgressPanel from "../../../components/UI/OnboardingProgressPanel";
import {
  clearPendingRootActivation,
  getPendingRootActivationEmail,
} from "../pending-root-activation";

const AdminInit = () => {
  const { initStep, token, onNextStep, onTokenValidated, restart } =
    useAdminInit();
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

  const renderSetupPanel = (content: ReactNode, step: 1 | 2 | 3) => (
    <OnboardingProgressPanel
      contentKey={String(step)}
      currentStep={step}
      stepCount={3}
      progressLabel="Progression de la configuration"
      className="flex-none"
      contentClassName="overflow-visible"
    >
      {content}
    </OnboardingProgressPanel>
  );

  if (pendingActivationEmail) {
    return renderSetupPanel(
      <AdminSignInForm
        token=""
        initialActivationEmail={pendingActivationEmail}
        onSuccess={() => navigate("/")}
        onRestart={restartCreation}
      />,
      3,
    );
  }

  if (invitedToken && invitedEmail) {
    return renderSetupPanel(
      <AdminSignInForm
        token={invitedToken}
        email={invitedEmail}
        onSuccess={() => navigate("/")}
        onRestart={() => {
          clearPendingRootActivation();
          navigate("/init", { replace: true });
        }}
      />,
      3,
    );
  }

  const renderStep = () => {
    switch (initStep) {
      case InitStep.Welcome:
        return <Welcome onNext={onNextStep} />;
      case InitStep.TokenForm:
        return <TokenForm onNext={onTokenValidated} />;
      case InitStep.SignInForm:
        return (
          <AdminSignInForm
            token={token!}
            onSuccess={() => navigate("/")}
            onRestart={restartCreation}
          />
        );
      default:
        return <Welcome onNext={onNextStep} />;
    }
  };

  return renderSetupPanel(renderStep(), (initStep + 1) as 1 | 2 | 3);
};

export default AdminInit;
