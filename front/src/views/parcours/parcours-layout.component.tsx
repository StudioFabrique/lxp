import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { casbinAuthorizer } from "../../config/rbac";
import Can from "../../components/UI/can/can.component";

const ParcoursLayout = () => {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    (async function () {
      const result = await casbinAuthorizer.can("write", "parcours");
      setHasAccess(result);
    })();
  }, []);

  return (
    <div>
      {hasAccess ? (
        <Link to="/parcours/créer-un-parcours">Créer un parcours</Link>
      ) : (
        <p className="text-base-content/50">Créer un parcours</p>
      )}
      <Outlet />
    </div>
  );
};

export default ParcoursLayout;
