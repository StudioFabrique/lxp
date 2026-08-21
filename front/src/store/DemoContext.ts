import { createContext, useContext } from "react";

export type DemoConfig = {
  demoMode: boolean;
  demoUrl: string;
  exitUrl: string;
  aiDisabled: boolean;
};

export type DemoContextValue = DemoConfig & { isConfigLoaded: boolean };

export const DEFAULT_DEMO_CONFIG: DemoConfig = {
  demoMode: false,
  demoUrl: "",
  exitUrl: "",
  aiDisabled: false,
};

export const DemoContext = createContext<DemoContextValue>({
  ...DEFAULT_DEMO_CONFIG,
  isConfigLoaded: false,
});

/** Contexte de démonstration. `demoMode` vaut faux tant que la config n'est pas lue. */
export const useDemoMode = () => useContext(DemoContext);
