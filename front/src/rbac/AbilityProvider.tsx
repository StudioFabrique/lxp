import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { AuthContext } from "../store/AuthProvider";
import { AppAbility, createAppAbility } from "./ability";

export const AbilityContext = createContext<AppAbility>(createAppAbility());

export function AbilityProvider({ children }: PropsWithChildren) {
  const { user } = useContext(AuthContext);
  const ability = useMemo(
    () => createAppAbility(user?.abilityRules ?? []),
    [user?.abilityRules],
  );

  return <AbilityContext value={ability}>{children}</AbilityContext>;
}

