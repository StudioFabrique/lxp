import { FC, useCallback, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { IRoleItem } from "../../../views/role/role";
import RoleSelector from "./role-selector";
import useHttp from "../../../hooks/use-http";
import RessourcesByAction from "./ressources-by-action";

const PermissionsList: FC<{ roles: IRoleItem[] }> = ({ roles }) => {
  const { sendRequest, isLoading, error } = useHttp();

  const [currentRole, setCurrentRole] = useState<IRoleItem>(roles[0]);
  const [permissions, setPermissions] = useState([]);
  const [ressources, setRessources] = useState<{
    ressources: string[];
    roles: string[];
  } | null>(null);

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

    sendRequest({ path: `/permission/${currentRole.role}` }, applyData);
  }, [currentRole, sendRequest]);

  const handleChangePermission = (
    ressourceName: string,
    checked: boolean,
    action: string
  ) => {
    console.log(ressourceName);

    checked
      ? setPermissions((oldPermissions) =>
          oldPermissions.filter((permission: any) => {
            if (permission.action === action)
              return {
                ...permission,
                ressources: permission.ressources.push(ressourceName),
              };
            return permission;
          })
        )
      : setPermissions((oldPermissions) =>
          oldPermissions.filter((permission: any) => {
            if (permission.action === action)
              return {
                ...permission,
                ressources: permission.ressources.filter(
                  (res: string) => ressourceName !== res
                ),
              };
            return permission;
          })
        );
  };

  const handleSubmitPermissions = () => {
    const applyData = () => {};
  };

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
          onSetCurrentRole={setCurrentRole}
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
            <p className="bg-primary text-primary-content p-2 rounded-lg text-center">
              Permissions
            </p>
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
            onChangePermission={handleChangePermission}
          />
          <RessourcesByAction
            action="write"
            title="Écriture"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
          />
          <RessourcesByAction
            action="update"
            title="Mise à jour"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
          />
          <RessourcesByAction
            action="delete"
            title="Suppression"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
          />
        </div>
      )}
    </Wrapper>
  );
};

export default PermissionsList;
