import Welcome from "../components/Welcome";
import useAppInit, { InitStep } from "../hooks/useAppInit";

const AppInit = () => {
  const { initStep, onNextStep } = useAppInit();

  const renderStep = () => {
    switch (initStep) {
      case InitStep.Welcome:
        return <Welcome onNext={onNextStep} />;
      case InitStep.TokenForm:
        return;
      case InitStep.SignInForm:
        return;
      default:
        return;
    }
  };

  return renderStep();
};

export default AppInit;
