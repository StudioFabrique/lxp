import { FC } from "react";
import RoleItem from "./role-item";
import { IRoleItem } from "../../views/role/role";

const RoleList: FC<{ roles: IRoleItem[] }> = ({ roles }) => {
  return (
    <div className="flex flex-wrap gap-10">
      {roles.length > 0 ? (
        roles.map((role) => <RoleItem role={role} key={role._id} />)
      ) : (
        <p>Aucun rôles</p>
      )}
    </div>
  );
};

export default RoleList;
