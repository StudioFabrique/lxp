import { PropsWithChildren, useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { hasPermission } from "../../utils/rbac-helpers";

type Props = {
  action: string;
  object: string;
};

const PermissionGuard = ({
  children,
  action,
  object,
}: PropsWithChildren<Props>) => {
  const { user } = useContext(AuthContext);

  if (
    user &&
    (user.roles?.some((role) => role.rank === 1) ||
      (user.permissions && hasPermission(user.permissions, action, object)))
  ) {
    return <>{children}</>;
  }

  return null;
};

export default PermissionGuard;
