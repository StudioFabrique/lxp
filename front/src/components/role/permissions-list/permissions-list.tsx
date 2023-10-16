import { FC, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { IRoleItem } from "../../../views/role/role";
import RoleSelector from "./role-selector";

const PermissionsList: FC<{ roles: IRoleItem[] }> = ({ roles }) => {
  const [currentRole, setCurrentRole] = useState(roles[0]?.role);

  const handleChangeRole = (role: string) => {
    setCurrentRole(role);
  };

  useEffect(() => {}, [currentRole]);

  return (
    <Wrapper>
      <h2 className="font-bold">Gestion des permissions</h2>
      <RoleSelector
        roles={roles}
        currentRole={currentRole}
        onChangeRole={handleChangeRole}
      />
    </Wrapper>
  );
};

export default PermissionsList;
