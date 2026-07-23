import { PropsWithChildren, ReactNode, useContext } from "react";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { AppAction, AppSubject } from "../../rbac/ability";

type Props = {
  action: AppAction | string;
  object: AppSubject | string;
  fallback?: ReactNode;
};

const PermissionGuard = ({
  children,
  action,
  object,
  fallback = null,
}: PropsWithChildren<Props>) => {
  const ability = useContext(AbilityContext);
  return ability.can(action as AppAction, object as AppSubject)
    ? <>{children}</>
    : fallback;
};

export default PermissionGuard;
