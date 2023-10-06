import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import RoleList from "../../components/role/role-list";

export interface IRoleItem {
  _id: string;
  role: string;
  permCount: {
    read: number;
    write: number;
    update: number;
    delete: number;
  };
}

const Role = () => {
  const { sendRequest } = useHttp();
  const [roles, setRoles] = useState<IRoleItem[]>([]);

  /* const handleCopyItem = (roleName: ) => {

  }; */

  useEffect(() => {
    sendRequest({ path: "/permission" }, (data) => setRoles(data.data));
  }, [sendRequest]);

  return (
    <div className="flex flex-col gap-y-5 p-10">
      <h2 className="text-2xl font-semibold">Roles</h2>
      <RoleList roles={roles} setRoles={setRoles} />
    </div>
  );
};

export default Role;
