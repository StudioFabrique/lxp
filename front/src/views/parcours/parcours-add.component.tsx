import { useEffect, useState } from "react";
import ParcoursHeader from "../../components/groups-header/groups-header.component";
import ParcoursForm from "../../components/parcours-form/parcours-form.component";
import { casbinAuthorizer } from "../../config/rbac";

const ParcoursAdd = () => {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    (async function () {
      const result = await casbinAuthorizer.can("write", "parcours");
      setHasAccess(result);
    })();
  }, []);
  return (
    <>
      {hasAccess ? (
        <div className="w-full flex h-screen flex-col items-center px-4 py-8 gap-8">
          <ParcoursHeader />
          <ParcoursForm />
        </div>
      ) : (
        <p>
          Accès non autorisé, demandez à un administateur qu'il vous autorise
          l'accès à cette page
        </p>
      )}
    </>
  );
};

export default ParcoursAdd;
