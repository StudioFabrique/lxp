import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { casbinAuthorizer } from "../../config/rbac";
import Can from "../../components/UI/can/can.component";

const ParcoursLayout = () => {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    (async function () {
      console.log("rerender layout parcours");

      const result = await casbinAuthorizer.can("write", "parcours");
      setHasAccess(result);
    })();
  }, []);

  console.log({ hasAccess });

  return (
    <div>
      <Can action="write" subject="parcours">
        <Link to="/admin/parcours/créer-un-parcours">Créer un parcours</Link>
      </Can>
      <Outlet />
    </div>
  );
};

export default ParcoursLayout;
