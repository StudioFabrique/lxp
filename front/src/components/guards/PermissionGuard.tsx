import { PropsWithChildren, ReactNode, useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { hasPermission } from "../../utils/helpers/rbac-helpers";

type Props = {
  action: string;
  object: string;
  fallback?: ReactNode;
};

const PermissionGuard = ({
  children,
  action,
  object,
  fallback,
}: PropsWithChildren<Props>) => {
  const { user } = useContext(AuthContext);

  if (
    user &&
    user.permissions &&
    hasPermission(user.permissions, action, object)
  ) {
    return <>{children}</>;
  }

  return fallback;
};

export default PermissionGuard;
