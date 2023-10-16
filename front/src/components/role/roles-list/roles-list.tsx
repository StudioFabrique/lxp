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
      {roles.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Rôle</th>
              <th>Permissions</th>
              <th>C</th>
              <th>R</th>
              <th>U</th>
              <th>D</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
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
