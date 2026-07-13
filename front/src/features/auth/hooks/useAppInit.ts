import { useState } from "react";

export enum InitStep {
  Welcome,
  TokenForm,
  SignInForm,
}

export default function useAppInit() {
  const [initStep, setInitStep] = useState<InitStep>(InitStep.Welcome);

  const onNextStep = () => {
    setInitStep((prev) => prev + 1);
  };

  return { initStep, onNextStep };
}
