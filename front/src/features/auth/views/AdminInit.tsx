import { useNavigate, useSearchParams } from "react-router";
import Welcome from "../components/Welcome";
import TokenForm from "../components/TokenForm";
import AdminSignInForm from "../components/AdminSignInForm";
import useAdminInit, { InitStep } from "../hooks/useAdminInit";

const AdminInit = () => {
  const { initStep, token, onNextStep, onTokenValidated } = useAdminInit();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invitedToken = searchParams.get("token")?.trim() ?? "";
  const invitedEmail = searchParams.get("email")?.trim() ?? "";

  if (invitedToken && invitedEmail) {
    return (
      <AdminSignInForm
        token={invitedToken}
        email={invitedEmail}
        onSuccess={() => navigate("/")}
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
          <AdminSignInForm token={token!} onSuccess={() => navigate("/")} />
        );
      default:
        return <Welcome onNext={onNextStep} />;
    }
  };

  return renderStep();
};

export default AdminInit;
