import React, { ReactNode, useContext } from "react";
import { Context } from "../../../store/context.store";
import NoAccessPage from "../../../views/errors/403.component";
import hasPermission from "../../../utils/hasPermission";

type Props = {
  children: ReactNode;
  action: string;
  subject: string;
};

const CanAccessPage: React.FC<Props> = ({ children, action, subject }) => {
  const { user } = useContext(Context);

  if (
    user &&
    user.permissions &&
    hasPermission(user.permissions, action, subject)
  ) {
    return <>{children}</>;
  }

  return <NoAccessPage />;
};

export default CanAccessPage;
