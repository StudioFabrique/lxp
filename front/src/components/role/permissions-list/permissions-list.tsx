import { FC, useCallback, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { IRoleItem } from "../../../views/role/role";
import RoleSelector from "./role-selector";
import useHttp from "../../../hooks/use-http";
import PermissionItem from "./permission-item";

const PermissionsList: FC<{ roles: IRoleItem[] }> = ({ roles }) => {
  const { sendRequest, isLoading, error } = useHttp();

  const [currentRole, setCurrentRole] = useState(roles[0]?.role);
  const [permissions, setPermissions] = useState([]);
  const [ressources, setRessources] = useState([]);

  const handleChangeRole = (role: string) => {
    setCurrentRole(role);
  };

  const handleGetRessources = useCallback(() => {
    const applyData = (data: any) => {
      console.log({ data });

      // setRessources(data.data);
    };

    sendRequest({ path: `/permission/ressources`, method: "get" }, applyData);
  }, [sendRequest]);

  /* const handleGetPermissions = useCallback(() => {
    const applyData = (data: any) => {
      console.log(data.data);

      setPermissions(data.data);
    };

    sendRequest({ path: `/permission/${currentRole}` }, applyData);
  }, [currentRole, sendRequest]); */

  useEffect(() => {
    handleGetRessources();
    // handleGetPermissions();
  }, [/* handleGetPermissions, */ handleGetRessources]);

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Gestion des permissions</h2>
      <RoleSelector
        roles={roles}
        currentRole={currentRole}
        onChangeRole={handleChangeRole}
      />
      {isLoading ? (
        <span className="loading loading-spinner" />
      ) : (
        <div className="flex justify-between gap-x-5">
          <div className="flex flex-col gap-y-5 w-full">
            <p className="bg-primary p-2 rounded-lg text-center">Permissions</p>
            {ressources.map((res) => (
              <p
                key={res}
                className="bg-secondary p-2 rounded-lg capitalize"
              >{`Gestion ${res}`}</p>
            ))}
          </div>
          <div className="flex flex-col gap-y-5 items-center w-full">
            <p className="bg-secondary p-2 rounded-lg w-full text-center">
              Lecture
            </p>
            {permissions.map((perm: any) => {
              if (perm.action === "read")
                return ressources.map((res) => (
                  <PermissionItem
                    key={res}
                    item={res}
                    isDefaultChecked={perm.ressources.includes(res)}
                  />
                ));
              return undefined;
            })}
          </div>
          <div className="flex flex-col gap-y-5 items-center w-full">
            <p className="bg-secondary p-2 rounded-lg w-full text-center">
              Écriture
            </p>
            {permissions.map((perm: any) => {
              if (perm.action === "write")
                return ressources.map((res) => (
                  <PermissionItem
                    key={res}
                    item={res}
                    isDefaultChecked={perm.ressources.includes(res)}
                  />
                ));
              return undefined;
            })}
          </div>
          <div className="flex flex-col gap-y-5 items-center w-full">
            <p className="bg-secondary p-2 rounded-lg w-full text-center">
              Mise à jour
            </p>
            {permissions.map((perm: any) => {
              if (perm.action === "update")
                return ressources.map((res) => (
                  <PermissionItem
                    key={res}
                    item={res}
                    isDefaultChecked={perm.ressources.includes(res)}
                  />
                ));
              return undefined;
            })}
          </div>
          <div className="flex flex-col gap-y-5 items-center w-full">
            <p className="bg-secondary p-2 rounded-lg w-full text-center">
              Suppression
            </p>
            {permissions.map((perm: any) => {
              if (perm.action === "delete")
                return ressources.map((res) => (
                  <PermissionItem
                    key={res}
                    item={res}
                    isDefaultChecked={perm.ressources.includes(res)}
                  />
                ));
              return undefined;
            })}
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default PermissionsList;
