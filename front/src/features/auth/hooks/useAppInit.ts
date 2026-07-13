import { useState } from "react";

export enum InitStep {
  Welcome,
  TokenForm,
  SignInForm,
}

export default function useAppInit() {
  const [initStep, setInitStep] = useState<InitStep>(InitStep.Welcome);
  const [token, setToken] = useState<string | null>(null);

  const onNextStep = () => {
    setInitStep((prev) => prev + 1);
  };

  const onTokenValidated = (validatedToken: string) => {
    setToken(validatedToken);
    setInitStep(InitStep.SignInForm);
  };

  return { initStep, token, onNextStep, onTokenValidated };
}
