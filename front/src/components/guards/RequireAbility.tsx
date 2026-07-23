import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { AppAction, AppSubject } from "../../rbac/ability";

export default function RequireAbility({
  action,
  subject,
}: {
  action: AppAction;
  subject: AppSubject;
}) {
  const ability = useContext(AbilityContext);
  if (!ability.can(action, subject)) {
    return <Navigate replace to="/access-denied" />;
  }
  return <Outlet />;
}

