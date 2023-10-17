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
            {staticsRessources.map((perm) => (
              <p>{perm}</p>
            ))}
          </div>
          {permissions.map((item: any) => (
            <PermissionItem key={item._id} item={item} />
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default PermissionsList;
