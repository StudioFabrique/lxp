import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import RoleItem from "./role-item";

export interface IRoleItem {
  _id: string;
  role: string;
  permCount: number;
}

const Role = () => {
  const { sendRequest } = useHttp();
  const [roles, setRoles] = useState<IRoleItem[]>([]);

  useEffect(() => {
    sendRequest({ path: "/permission" }, (data) => setRoles(data.data));
  }, [sendRequest]);

  const rolesList =
    roles.length > 0 ? (
      roles.map((role) => <RoleItem role={role} key={role._id} />)
    ) : (
      <p>Aucun rôles</p>
    );

  return (
    <div className="flex flex-col gap-y-5 p-10">
      <h2 className="text-xl font-semibold">Roles</h2>
      <div className="flex flex-wrap gap-10">{rolesList}</div>
    </div>
  );
};

export default Role;
