import { FC, useCallback, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { IRoleItem } from "../../../views/role/role";
import RoleSelector from "./role-selector";
import useHttp from "../../../hooks/use-http";

const PermissionsList: FC<{ roles: IRoleItem[] }> = ({ roles }) => {
  const { sendRequest, isLoading, error } = useHttp();

  const [currentRole, setCurrentRole] = useState(roles[0]?.role);
  const [permissions, setPermissions] = useState([]);

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
    if (currentRole) handleGetPermissions();
  }, [currentRole, handleGetPermissions]);

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
        <table>
          <thead>
            <tr>
              <th>Permissions</th>
              <th>Create</th>
              <th>Read</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{permissions.map(permission => )}</tbody>
        </table>
      )}
    </Wrapper>
  );
};

export default PermissionsList;
