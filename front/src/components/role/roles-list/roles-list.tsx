import { Dispatch, FC, SetStateAction } from "react";
import { IRoleItem } from "../../../views/role/role";
import RoleItem from "./role-item";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DownloadIcon from "../../UI/svg/download-icon";

const RolesList: FC<{
  roles: IRoleItem[];
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
  setRoleToEdit: Dispatch<
    SetStateAction<{
      _id: string;
      name: string;
    } | null>
  >;
}> = ({ roles, setRoles, setRoleToEdit }) => {
  return (
    <Wrapper>
      <div className="flex justify-between">
        <h2 className="font-bold text-xl">Gestion des rôles</h2>
        <button type="button" onClick={() => {}} className="flex gap-2">
          <p>exporter les rôles en .csv</p>
          <span className="w-6 h-6">
            <DownloadIcon />
          </span>
        </button>
      </div>
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
          <tbody className="h-[22em] overflow-y-auto gap-y-4 grid text-primary-content">
            {roles.map((role) => (
              <RoleItem
                key={role._id}
                role={role}
                setRoles={setRoles}
                setRoleToEdit={setRoleToEdit}
              />
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
