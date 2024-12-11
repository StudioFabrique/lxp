/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { IRoleItem } from "../../../views/role/role";
import RoleSelector from "./role-selector";
import useHttp from "../../../hooks/use-http";
import RessourcesByAction from "./ressources-by-action";
import { Context } from "../../../store/context.store";

const PermissionsList: FC<{
  roles: IRoleItem[];
  currentRole: IRoleItem;
  setCurrentRole: Dispatch<SetStateAction<IRoleItem>>;
}> = ({ roles, currentRole, setCurrentRole }) => {
  const { handshake } = useContext(Context);
  const { sendRequest, isLoading: isLoadingPermissions } = useHttp(true);

  const [permissions, setPermissions] = useState<string[]>([]);
  const [ressources, setRessources] = useState<{
    ressources: string[];
    roles: string[];
  } | null>(null);

  const handleChangePermission = useCallback(
    (ressourceName: string, checked: boolean, action: string) => {
      const permission = `${action}:${ressourceName}`;

      if (checked) {
        setPermissions((prev) => [...prev, permission]);
      } else {
        setPermissions((prev) => prev.filter((p) => p !== permission));
      }
    },
    [],
  );

  const handleSubmitPermissions = useCallback(() => {
    const applyData = () => {
      if (roles.some((role) => role.role === currentRole._id)) handshake();
    };

    sendRequest(
      {
        path: `/permission/role/${currentRole._id}`,
        body: { permissions },
        method: "put",
      },
      applyData,
    );
  }, [currentRole._id, permissions, roles, handshake, sendRequest]);

  const handleGetPermissions = useCallback(() => {
    const applyData = (data: any) => {
      setPermissions(data.data.permissions);
      setRessources(data.data.ressources);
    };

    sendRequest(
      { path: `/permission/ressources/${currentRole.role}` },
      applyData,
    );
  }, [currentRole, sendRequest]);

  useEffect(() => {
    handleGetPermissions();
  }, [handleGetPermissions]);

  const ressourcesElements = useMemo(
    () => (
      <>
        {ressources?.ressources.map((res) => (
          <p
            key={res}
            className="bg-secondary/90 text-secondary-content p-2 rounded-lg capitalize"
          >{`Gestion ${res}`}</p>
        ))}
        <hr className="border-black w-[105%]" />
        {ressources?.roles.map((res) => (
          <p
            key={res}
            className="bg-primary text-primary-content p-2 rounded-lg capitalize"
          >{`Gestion ${res}`}</p>
        ))}
      </>
    ),
    [ressources],
  );

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Gestion des permissions</h2>
      <div className="flex justify-between items-center my-5">
        <RoleSelector
          roles={roles}
          currentRole={currentRole}
          onSetCurrentRole={setCurrentRole}
        />

        <button
          onClick={handleSubmitPermissions}
          type="button"
          className="btn btn-primary"
        >
          Sauvegarder
        </button>
      </div>
      {isLoadingPermissions ? (
        <span className="loading loading-spinner" />
      ) : (
        <div className="flex justify-between">
          <div className="flex flex-col gap-y-5 w-full">
            <p className="bg-primary text-primary-content p-2 rounded-lg text-center">
              Permissions
            </p>
            {ressourcesElements}
          </div>
          <span className="w-10" />
          <RessourcesByAction
            action="read"
            title="Lecture"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
            roundedLeft
          />
          <RessourcesByAction
            action="write"
            title="Création"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
          />
          <RessourcesByAction
            action="update"
            title="Édition"
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
            roundedRight
          />
        </div>
      )}
    </Wrapper>
  );
};

export default PermissionsList;
