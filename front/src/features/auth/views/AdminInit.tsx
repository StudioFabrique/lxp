import { useNavigate, useSearchParams } from "react-router";
import Welcome from "../components/Welcome";
import TokenForm from "../components/TokenForm";
import AdminSignInForm from "../components/AdminSignInForm";
import useAdminInit, { InitStep } from "../hooks/useAdminInit";
import { useState, type ReactNode } from "react";
import AdminSetupLayout from "../components/AdminSetupLayout";
import {
  clearPendingRootActivation,
  getPendingRootActivationEmail,
} from "../pending-root-activation";

const AdminInit = () => {
  const { initStep, token, onNextStep, onPreviousStep, onTokenValidated, restart } =
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
        content = <TokenForm onNext={onTokenValidated} onPrevious={onPreviousStep} />;
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
  const isTokenForm =
    !pendingActivationEmail &&
    !(invitedToken && invitedEmail) &&
    initStep === InitStep.TokenForm;

  return (
    <AdminSetupLayout
      isWelcome={isWelcome}
      currentStep={panelStep}
      contentClassName={isTokenForm ? "root-activation-content" : undefined}
    >
      {content}
    </AdminSetupLayout>
  );
};

export default AdminInit;
