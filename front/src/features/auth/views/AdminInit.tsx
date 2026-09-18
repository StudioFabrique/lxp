import { useNavigate, useSearchParams } from "react-router";
import Welcome from "../components/Welcome";
import TokenForm from "../components/TokenForm";
import AdminSignInForm from "../components/AdminSignInForm";
import useAdminInit, { InitStep } from "../hooks/useAdminInit";
import { useState } from "react";
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

  if (pendingActivationEmail) {
    return (
      <AdminSignInForm
        token=""
        initialActivationEmail={pendingActivationEmail}
        onSuccess={() => navigate("/")}
        onRestart={restartCreation}
      />
    );
  }

  if (invitedToken && invitedEmail) {
    return (
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

  return renderStep();
};

export default AdminInit;
