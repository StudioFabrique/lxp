import { Dispatch, FC, SetStateAction } from "react";
import { IRoleItem } from "../../../views/role/role";
import RoleItem from "./role-item";
import Wrapper from "../../UI/wrapper/wrapper.component";

const RolesList: FC<{
  roles: IRoleItem[];
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
}> = ({ roles, setRoles }) => {
  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Gestion des rôles</h2>
      {roles.length > 0 ? (
        <table className="table grid">
          <thead className="">
            <tr className="grid grid-cols-10">
              <th></th>
              <th>Rôle</th>
              <th className="col-span-2">Permissions</th>
              <th>C</th>
              <th>R</th>
              <th>U</th>
              <th>D</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody className="h-[14em] overflow-y-auto">
            {roles.map((role) => (
              <RoleItem key={role._id} role={role} setRoles={setRoles} />
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun rôles</p>
      )}
    </Wrapper>
  );
};

export default RolesList;
