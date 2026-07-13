import { useNavigate } from "react-router";
import Welcome from "../components/Welcome";
import TokenForm from "../components/TokenForm";
import AdminSignInForm from "../components/AdminSignInForm";
import useAppInit, { InitStep } from "../hooks/useAppInit";

const AppInit = () => {
  const { initStep, token, onNextStep, onTokenValidated } = useAppInit();
  const navigate = useNavigate();

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
            onSuccess={() => navigate("/login")}
          />
        );
      default:
        return <Welcome onNext={onNextStep} />;
    }
  };

  return renderStep();
};

export default AppInit;
