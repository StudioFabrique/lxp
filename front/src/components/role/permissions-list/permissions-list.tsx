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
  const [staticsRessources, setStaticsRessources] = useState([
    "admin",
    "mini-admin",
    "teacher",
    "student",
    "coach",
    "boss_teacher",
    "stagiaire",
    "everything",
    "role",
    "tag",
    "permission",
    "user",
    "group",
    "formation",
    "parcours",
    "module",
    "course",
    "bonusSkill",
  ]);

  const handleChangeRole = (role: string) => {
    setCurrentRole(role);
  };

  const handleGetPermissions = useCallback(() => {
    const applyData = (data: any) => {
      console.log(data.data);

      setPermissions(data.data);
    };

    sendRequest({ path: `/permission/${currentRole}` }, applyData);
  }, [currentRole, sendRequest]);

  useEffect(() => {
    handleGetPermissions();
  }, [handleGetPermissions]);

  return (
    <Wrapper>
      <h2 className="font-bold">Gestion des permissions</h2>
      <RoleSelector
        roles={roles}
        currentRole={currentRole}
        onChangeRole={handleChangeRole}
      />
      {isLoading ? (
        <span className="loading loading-spinner" />
      ) : (
        <div className="flex justify-between gap-5">
          <div className="flex flex-col">
            <p>Permissions</p>
            {staticsRessources.map((res) => (
              <p>{res}</p>
            ))}
          </div>
          <div className="flex flex-col">
            <p>Lecture</p>
            {permissions.map((perm: any) => {
              if (perm.action === "read")
                return staticsRessources.map((res) => (
                  <PermissionItem
                    key={res}
                    item={res}
                    isDefaultChecked={perm.ressources.includes(res)}
                  />
                ));
              return undefined;
            })}
          </div>
          <div className="flex flex-col">
            <p>Écriture</p>
            {permissions.map((perm: any) => {
              if (perm.action === "write")
                return staticsRessources.map((res) => (
                  <PermissionItem
                    key={res}
                    item={res}
                    isDefaultChecked={perm.ressources.includes(res)}
                  />
                ));
              return undefined;
            })}
          </div>
          <div className="flex flex-col">
            <p>Mise à jour</p>
            {permissions.map((perm: any) => {
              if (perm.action === "update")
                return staticsRessources.map((res) => (
                  <PermissionItem
                    key={res}
                    item={res}
                    isDefaultChecked={perm.ressources.includes(res)}
                  />
                ));
              return undefined;
            })}
          </div>
          <div className="flex flex-col">
            <p>Suppression</p>
            {permissions.map((perm: any) => {
              if (perm.action === "delete")
                return staticsRessources.map((res) => (
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
