import React, { ReactNode } from "react";
import { casbinAuthorizer } from "../../../config/rbac";

type Props = {
  children: ReactNode;
  action: string;
  subject: string;
};

const Can: React.FC<Props> = ({ children, action, subject }) => {
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    (async function () {
      if (casbinAuthorizer !== null && casbinAuthorizer !== undefined) {
        const shouldRender = await casbinAuthorizer.can(action, subject);
        setRender(shouldRender);
      }
    })();
  }, [action, subject]);

  if (render) return <>{children}</>;

  return null;
};

export default Can;
