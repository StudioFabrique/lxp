import React, { ReactNode } from "react";
import { casbinAuthorizer } from "../../../config/rbac";

type Props = {
  children: ReactNode;
  action: string;
  object: string;
};

const Can: React.FC<Props> = ({ children, action, object }) => {
  const [render, setRender] = React.useState(false);

  React.useEffect(() => {
    (async function () {
      if (casbinAuthorizer !== null && casbinAuthorizer !== undefined) {
        const shouldRender = await casbinAuthorizer.can(action, object);
        setRender(shouldRender);
      }
    })();
  }, [action, object]);

  if (render) return <>{children}</>;

  return null;
};

export default Can;
