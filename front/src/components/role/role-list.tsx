import { Dispatch, FC, SetStateAction } from "react";
import RoleItem from "./role-item";
import { IRoleItem } from "../../views/role/role";

const RoleList: FC<{
  roles: IRoleItem[];
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
}> = ({ roles, setRoles }) => {
  return (
    <div className="flex flex-wrap gap-10">
      {roles.length > 0 ? (
        roles.map((role) => (
          <RoleItem key={role._id} role={role} setRoles={setRoles} />
        ))
      ) : (
        <p>Aucun rôles</p>
      )}
    </div>
  );
};

export default RoleList;
