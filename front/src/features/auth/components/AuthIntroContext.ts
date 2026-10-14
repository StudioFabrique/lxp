import { createContext } from "react";

export const AuthIntroContext = createContext<(active: boolean) => void>(() => undefined);
