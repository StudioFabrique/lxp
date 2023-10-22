import { FC, useCallback, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { IRoleItem } from "../../../views/role/role";
import RoleSelector from "./role-selector";
import useHttp from "../../../hooks/use-http";
import RessourcesByAction from "./ressources-by-action";

const PermissionsList: FC<{ roles: IRoleItem[] }> = ({ roles }) => {
  const { sendRequest, isLoading, error } = useHttp();

  const [currentRole, setCurrentRole] = useState(roles[0]?.role);
  const [permissions, setPermissions] = useState([]);
  const [ressources, setRessources] = useState<{
    ressources: string[];
    roles: string[];
  } | null>(null);

  const handleChangeRole = (role: string) => {
    setCurrentRole(role);
  };

  const handleGetRessources = useCallback(() => {
    const applyData = (data: any) => {
      setRessources(data.data);
    };

    sendRequest({ path: `/permission/ressources` }, applyData);
  }, [sendRequest]);

  const handleGetPermissions = useCallback(() => {
    const applyData = (data: any) => {
      setPermissions(data.data);
    };

    sendRequest({ path: `/permission/${currentRole}` }, applyData);
  }, [currentRole, sendRequest]);

  useEffect(() => {
    handleGetRessources();
    handleGetPermissions();
  }, [handleGetPermissions, handleGetRessources]);

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Gestion des permissions</h2>
      <div className="flex justify-between items-center my-5">
        <RoleSelector
          roles={roles}
          currentRole={currentRole}
          onChangeRole={handleChangeRole}
        />
        <button type="button" className="btn btn-primary">
          Sauvegarder
        </button>
      </div>
      {isLoading ? (
        <span className="loading loading-spinner" />
      ) : (
        <div className="flex justify-between">
          <div className="flex flex-col gap-y-5 w-full">
            <p className="bg-primary p-2 rounded-lg text-center">Permissions</p>
            {ressources?.ressources.map((res) => (
              <p
                key={res}
                className="bg-secondary p-2 rounded-lg capitalize"
              >{`Gestion ${res}`}</p>
            ))}
            <hr className="border-black w-[105%]" />
            {ressources?.roles.map((res) => (
              <p
                key={res}
                className="bg-secondary p-2 rounded-lg capitalize"
              >{`Gestion ${res}`}</p>
            ))}
          </div>
          <span className="w-10" />
          <RessourcesByAction
            action="read"
            title="Lecture"
            ressources={ressources}
            unfilteredPermissions={permissions}
          />
          <RessourcesByAction
            action="write"
            title="Écriture"
            ressources={ressources}
            unfilteredPermissions={permissions}
          />
          <RessourcesByAction
            action="update"
            title="Mise à jour"
            ressources={ressources}
            unfilteredPermissions={permissions}
          />
          <RessourcesByAction
            action="delete"
            title="Suppression"
            ressources={ressources}
            unfilteredPermissions={permissions}
          />
        </div>
      )}
    </Wrapper>
  );
};

export default PermissionsList;
