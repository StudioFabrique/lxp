import React, { ReactNode, useContext } from "react";
import { casbinAuthorizer } from "../../../config/rbac";
import { Context } from "../../../store/context.store";

type Props = {
  children: ReactNode;
  action: string;
  object: string;
};

const Can: React.FC<Props> = ({ children, action, object }) => {
  const { builtPerms } = useContext(Context);
  const [render, setRender] = React.useState(true);

  React.useEffect(() => {
    (async function () {
      if (casbinAuthorizer) {
        const shouldRender = await casbinAuthorizer.can(action, object);
        setRender(shouldRender);
      }
    })();
  }, [action, object, builtPerms]);

  if (!render) {
    console.log("supposed to not being rendered");
    return false;
  }

  return <>{children}</>;
};

export default Can;
