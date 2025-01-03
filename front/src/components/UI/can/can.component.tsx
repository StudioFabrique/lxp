import React, { ReactNode, useContext } from "react";
import { Context } from "../../../store/context.store";
import hasPermission from "../../../utils/hasPermission";

type Props = {
  children: ReactNode;
  action: string;
  object: string;
};

const Can: React.FC<Props> = ({ children, action, object }) => {
  const { user } = useContext(Context);

  if (
    user &&
    user.permissions &&
    hasPermission(user.permissions, action, object)
  ) {
    return <>{children}</>;
  }

  return null;
};

export default Can;
